import uuid
from decimal import Decimal
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from server.db.base import Base
from server.db.session import engine, SessionLocal
from server.models.user import User
from server.models.wallet import Wallet
from server.models.category import Category
from server.models.transaction import Transaction
from server.models.budget import Budget

def init_db():
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        demo_user = db.query(User).filter(User.email == "demo@budgetly.app").first()
        if not demo_user:
            demo_user = User(
                id=uuid.uuid4(),
                email="demo@budgetly.app",
                password_hash="mock_bcrypt_hash_for_demo",
                full_name="Nguyen Tung Lam & Le Huu Anh Tu"
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            default_categories = [
                {"name": "Food & Dining", "type": "EXPENSE", "icon": "🍲", "color": "bg-amber-500"},
                {"name": "Transportation", "type": "EXPENSE", "icon": "🚗", "color": "bg-blue-500"},
                {"name": "Shopping", "type": "EXPENSE", "icon": "🛍️", "color": "bg-purple-500"},
                {"name": "Entertainment", "type": "EXPENSE", "icon": "🎬", "color": "bg-rose-500"},
                {"name": "Utilities", "type": "EXPENSE", "icon": "⚡", "color": "bg-teal-500"},
                {"name": "Salary & Income", "type": "INCOME", "icon": "💵", "color": "bg-emerald-500"},
                {"name": "Miscellaneous", "type": "EXPENSE", "icon": "📦", "color": "bg-slate-500"},
            ]
            cat_map = {}
            for cat_data in default_categories:
                cat = Category(
                    id=uuid.uuid4(),
                    user_id=demo_user.id,
                    name=cat_data["name"],
                    type=cat_data["type"],
                    icon=cat_data["icon"],
                    color=cat_data["color"],
                    is_default=True
                )
                db.add(cat)
                cat_map[cat_data["name"]] = cat
            db.commit()

            w1 = Wallet(id=uuid.uuid4(), user_id=demo_user.id, name="Cash Wallet", balance=Decimal("2500000"), currency="VND")
            w2 = Wallet(id=uuid.uuid4(), user_id=demo_user.id, name="Bank Account", balance=Decimal("18500000"), currency="VND")
            w3 = Wallet(id=uuid.uuid4(), user_id=demo_user.id, name="E-Wallet", balance=Decimal("3500000"), currency="VND")
            db.add_all([w1, w2, w3])
            db.commit()

            now = datetime.utcnow()
            txs = [
                Transaction(
                    id=uuid.uuid4(),
                    wallet_id=w1.id,
                    category_id=cat_map["Food & Dining"].id,
                    amount=Decimal("45000"),
                    transaction_type="EXPENSE",
                    transaction_date=now - timedelta(hours=2),
                    description="Team lunch at downtown cafe",
                    input_method="NLP",
                    ai_confidence_score=0.92
                ),
                Transaction(
                    id=uuid.uuid4(),
                    wallet_id=w2.id,
                    category_id=cat_map["Transportation"].id,
                    amount=Decimal("50000"),
                    transaction_type="EXPENSE",
                    transaction_date=now - timedelta(hours=5),
                    description="Gas station refill",
                    input_method="NLP",
                    ai_confidence_score=0.95
                ),
                Transaction(
                    id=uuid.uuid4(),
                    wallet_id=w2.id,
                    category_id=cat_map["Salary & Income"].id,
                    amount=Decimal("15000000"),
                    transaction_type="INCOME",
                    transaction_date=now - timedelta(days=28),
                    description="Monthly salary deposit",
                    input_method="MANUAL"
                ),
                Transaction(
                    id=uuid.uuid4(),
                    wallet_id=w2.id,
                    category_id=cat_map["Shopping"].id,
                    amount=Decimal("350000"),
                    transaction_type="EXPENSE",
                    transaction_date=now - timedelta(days=1),
                    description="Online clothing order",
                    input_method="MANUAL"
                ),
                Transaction(
                    id=uuid.uuid4(),
                    wallet_id=w3.id,
                    category_id=cat_map["Food & Dining"].id,
                    amount=Decimal("65000"),
                    transaction_type="EXPENSE",
                    transaction_date=now - timedelta(days=2),
                    description="Coffee meeting with teammates",
                    input_method="NLP",
                    ai_confidence_score=0.88
                ),
                Transaction(
                    id=uuid.uuid4(),
                    wallet_id=w3.id,
                    category_id=cat_map["Utilities"].id,
                    amount=Decimal("200000"),
                    transaction_type="EXPENSE",
                    transaction_date=now - timedelta(days=4),
                    description="Mobile internet subscription",
                    input_method="OCR",
                    ai_confidence_score=0.90
                ),
            ]
            db.add_all(txs)
            db.commit()

            current_month = now.strftime("%Y-%m")
            b1 = Budget(
                id=uuid.uuid4(),
                user_id=demo_user.id,
                category_id=cat_map["Food & Dining"].id,
                amount_limit=Decimal("5000000"),
                month_year=current_month
            )
            b2 = Budget(
                id=uuid.uuid4(),
                user_id=demo_user.id,
                category_id=cat_map["Shopping"].id,
                amount_limit=Decimal("3000000"),
                month_year=current_month
            )
            db.add_all([b1, b2])
            db.commit()

    finally:
        db.close()

if __name__ == "__main__":
    init_db()
