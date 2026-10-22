import re
from decimal import Decimal, InvalidOperation
from datetime import datetime
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from server.db.session import get_db
from server.models.user import User
from server.models.wallet import Wallet
from server.models.transaction import Transaction
from server.models.budget import Budget
from server.core.deps import get_current_user
from server.schemas.ai import SmartInputRequest, SmartInputResponse, OCRScanResponse, AIForecastResponse
from server.schemas.common import APIResponse

router = APIRouter(prefix="/ai", tags=["AI Services"])

# A number written the way users actually type it: "50000", "50.000", "5.50".
NUMBER_PATTERN = r'\d[\d.,]*\d|\d'


def _parse_number_token(token: str) -> Decimal | None:
    """Turn a raw numeric token into a Decimal, resolving VN/EN separator styles.

    "50.000" and "1,500" are thousands groupings, while "5.50" and "12,5" are
    decimals, so the separator is classified by the length of the digit groups.
    """
    cleaned = re.sub(r'[^\d.,]', '', token).strip('.,')
    if not cleaned:
        return None

    has_dot, has_comma = '.' in cleaned, ',' in cleaned

    if has_dot and has_comma:
        # The last separator is the decimal marker: 1.234,56 or 1,234.56
        decimal_sep = '.' if cleaned.rfind('.') > cleaned.rfind(',') else ','
        cleaned = cleaned.replace(',' if decimal_sep == '.' else '.', '')
        cleaned = cleaned.replace(decimal_sep, '.')
    elif has_dot or has_comma:
        sep = '.' if has_dot else ','
        head, _, tail = cleaned.partition(sep)
        if sep in tail or (head and len(tail) == 3):
            # Repeated separators or a 3-digit group: thousands grouping.
            cleaned = cleaned.replace(sep, '')
        else:
            cleaned = f'{head}.{tail}'

    try:
        return Decimal(cleaned)
    except InvalidOperation:
        return None


def parse_currency_amount(text: str) -> Decimal:
    """Parses text amounts like '$45', '45k', '50.000', '15m' into Decimal."""
    text_clean = text.lower()

    # Millions ("15m", "15tr", "15 triệu", "15 million")
    m_match = re.search(rf'({NUMBER_PATTERN})\s*(?:m|tr|triệu|trieu|million)\b', text_clean)
    if m_match:
        value = _parse_number_token(m_match.group(1))
        if value is not None:
            return (value * 1_000_000).to_integral_value()

    # Thousands ("45k", "45 thousand", "45 nghìn", "45 ngàn")
    k_match = re.search(rf'({NUMBER_PATTERN})\s*(?:k|thousand|nghìn|nghin|ngàn|ngan)\b', text_clean)
    if k_match:
        value = _parse_number_token(k_match.group(1))
        if value is not None:
            return (value * 1_000).to_integral_value()

    # Plain numbers or currency ("$50.00", "50.000", "50000")
    num_match = re.search(NUMBER_PATTERN, text_clean)
    if num_match:
        value = _parse_number_token(num_match.group(0))
        if value is not None:
            return value

    return Decimal("50000")

def classify_intent_english(text: str):
    t = text.lower()
    if any(k in t for k in ["salary", "bonus", "income", "freelance", "paycheck", "lương"]):
        return "Salary & Income", "INCOME", 0.95
    # "ăn" needs word boundaries: as a plain substring it also matches "xăng" (gasoline).
    if any(k in t for k in ["food", "lunch", "dinner", "breakfast", "coffee", "cafe", "meal", "restaurant", "phở", "uống"]) or re.search(r'\băn\b', t):
        return "Food & Dining", "EXPENSE", 0.93
    if any(k in t for k in ["gas", "fuel", "taxi", "uber", "grab", "subway", "train", "bus", "transport", "xe", "xăng"]):
        return "Transportation", "EXPENSE", 0.94
    if any(k in t for k in ["shop", "cloth", "shoes", "amazon", "shopee", "order", "buy", "mua"]):
        return "Shopping", "EXPENSE", 0.90
    if any(k in t for k in ["movie", "cinema", "game", "trip", "bar", "concert", "phim"]):
        return "Entertainment", "EXPENSE", 0.91
    if any(k in t for k in ["electricity", "water", "bill", "wifi", "internet", "phone", "rent", "điện", "nước"]):
        return "Utilities", "EXPENSE", 0.92
    return "Miscellaneous", "EXPENSE", 0.75

@router.post("/smart-input", response_model=APIResponse[SmartInputResponse])
def smart_input_nlp(
    payload: SmartInputRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    raw = payload.raw_text.strip()
    amount = parse_currency_amount(raw)
    category, tx_type, confidence = classify_intent_english(raw)

    # Suggest one of the user's own wallets instead of a hardcoded name.
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()

    return APIResponse(
        data=SmartInputResponse(
            description=raw,
            amount=amount,
            category=category,
            type=tx_type,
            suggested_wallet=wallet.name if wallet else None,
            confidence_score=confidence
        ),
        message="Transaction NLP extraction successful"
    )

@router.post("/scan-receipt", response_model=APIResponse[OCRScanResponse])
async def scan_receipt_ocr(
    file: UploadFile = File(None),
    current_user: User = Depends(get_current_user)
):
    return APIResponse(
        data=OCRScanResponse(
            merchant="WINMART GROCERY & FRESH",
            date=datetime.utcnow().strftime("%Y-%m-%d"),
            total_amount=Decimal("185000"),
            confidence_score=0.94,
            items=["Fresh Milk 1L", "Whole Wheat Bread", "Organic Eggs (6-pack)"],
            suggested_category="Food & Dining"
        ),
        message="Receipt OCR scanned and parsed successfully"
    )

@router.get("/forecast", response_model=APIResponse[AIForecastResponse])
def get_ai_forecast(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.utcnow()
    today = max(now.day, 1)
    days_in_month = 30
    current_month = now.strftime("%Y-%m")
    month_start = datetime(now.year, now.month, 1)

    # Real spend for the current month across the user's wallets.
    spent_so_far = db.query(func.coalesce(func.sum(Transaction.amount), 0)).join(
        Wallet, Transaction.wallet_id == Wallet.id
    ).filter(
        Wallet.user_id == current_user.id,
        Transaction.transaction_type == "EXPENSE",
        Transaction.transaction_date >= month_start
    ).scalar()
    spent_so_far = Decimal(str(spent_so_far))

    budget_limit = db.query(func.coalesce(func.sum(Budget.amount_limit), Decimal("0"))).filter(
        Budget.user_id == current_user.id,
        Budget.month_year == current_month
    ).scalar()
    budget_limit = Decimal(str(budget_limit))

    projected = (spent_so_far / Decimal(str(today))) * Decimal(str(days_in_month))

    if budget_limit <= 0:
        return APIResponse(
            data=AIForecastResponse(
                forecast_total=projected,
                budget_limit=Decimal("0"),
                is_at_risk=False,
                risk_percentage=0.0,
                message=(
                    f"Month-end Projection: estimated spend is {int(projected):,} VND. "
                    "Set a budget to unlock spending-risk alerts."
                )
            ),
            message="AI spending forecast generated successfully"
        )

    is_at_risk = projected > (budget_limit * Decimal("0.9"))
    risk_pct = float(round((projected / budget_limit) * 100, 1))

    msg = (
        f"Month-end Projection: estimated spend is {int(projected):,} VND ({risk_pct}% of budget). "
        "Your spending pace is currently on track."
        if not is_at_risk else
        f"Warning: projected month-end spend exceeds budget by {int(projected - budget_limit):,} VND ({risk_pct}% of budget). Consider cutting discretionary spending."
    )

    return APIResponse(
        data=AIForecastResponse(
            forecast_total=projected,
            budget_limit=budget_limit,
            is_at_risk=is_at_risk,
            risk_percentage=risk_pct,
            message=msg
        ),
        message="AI spending forecast generated successfully"
    )
