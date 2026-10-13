import uuid
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.db.session import get_db
from server.models.user import User
from server.models.wallet import Wallet
from server.models.category import Category
from server.core.security import hash_password, verify_password, create_access_token
from server.core.deps import get_current_user
from server.schemas.auth import RegisterRequest, LoginRequest, AuthTokenResponse, UserResponse
from server.schemas.common import APIResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Default starter data created for every newly registered account.
DEFAULT_CATEGORIES = [
    {"name": "Food & Dining", "type": "EXPENSE", "icon": "🍲", "color": "bg-amber-500"},
    {"name": "Transportation", "type": "EXPENSE", "icon": "🚗", "color": "bg-blue-500"},
    {"name": "Shopping", "type": "EXPENSE", "icon": "🛍️", "color": "bg-purple-500"},
    {"name": "Utilities", "type": "EXPENSE", "icon": "⚡", "color": "bg-teal-500"},
    {"name": "Entertainment", "type": "EXPENSE", "icon": "🎬", "color": "bg-rose-500"},
    {"name": "Salary & Income", "type": "INCOME", "icon": "💵", "color": "bg-emerald-500"},
]


@router.post("/register", response_model=APIResponse[AuthTokenResponse])
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user account and return a ready-to-use session token."""
    email_clean = str(req.email).lower().strip()

    existing_user = db.query(User).filter(User.email == email_clean).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email address is already in use. Try another one or sign in."
        )

    new_user = User(
        id=uuid.uuid4(),
        email=email_clean,
        password_hash=hash_password(req.password),
        full_name=req.full_name.strip() if req.full_name else email_clean.split("@")[0]
    )
    db.add(new_user)
    db.flush()

    # Seed a starter catalog so the dashboard is usable right after sign-up.
    for cat in DEFAULT_CATEGORIES:
        db.add(Category(
            id=uuid.uuid4(),
            user_id=new_user.id,
            name=cat["name"],
            type=cat["type"],
            icon=cat["icon"],
            color=cat["color"],
            is_default=True
        ))

    db.add(Wallet(
        id=uuid.uuid4(),
        user_id=new_user.id,
        name="Cash Wallet",
        balance=Decimal("0"),
        currency="VND"
    ))

    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email})

    user_resp = UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        full_name=new_user.full_name,
        created_at=new_user.created_at
    )

    return APIResponse(
        data=AuthTokenResponse(
            access_token=token,
            token_type="bearer",
            user=user_resp
        ),
        message="Account created successfully. Welcome to Budgetly!"
    )


@router.post("/login", response_model=APIResponse[AuthTokenResponse])
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Verify credentials and return a JWT session token."""
    email_clean = str(req.email).lower().strip()

    user = db.query(User).filter(User.email == email_clean).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Please try again."
        )

    token = create_access_token(data={"sub": str(user.id), "email": user.email})

    user_resp = UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        created_at=user.created_at
    )

    return APIResponse(
        data=AuthTokenResponse(
            access_token=token,
            token_type="bearer",
            user=user_resp
        ),
        message="Signed in successfully."
    )


@router.get("/me", response_model=APIResponse[UserResponse])
def get_me(current_user: User = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return APIResponse(
        data=UserResponse(
            id=str(current_user.id),
            email=current_user.email,
            full_name=current_user.full_name,
            created_at=current_user.created_at
        ),
        message="Current user profile retrieved successfully"
    )
