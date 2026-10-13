import uuid
from decimal import Decimal
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from server.db.session import get_db
from server.models.user import User
from server.models.wallet import Wallet
from server.models.category import Category
from server.core.security import hash_password, verify_password, create_access_token, decode_access_token
from server.schemas.auth import RegisterRequest, LoginRequest, AuthTokenResponse, UserResponse
from server.schemas.common import APIResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])
security_bearer = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: Session = Depends(get_db)
) -> User:
    """Dependency lấy người dùng hiện tại từ JWT Bearer token."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Yêu cầu đăng nhập để truy cập tài nguyên này",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không chứa thông tin người dùng hợp lệ",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        user_uuid = uuid.UUID(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Định dạng mã người dùng trong token không hợp lệ",
        )

    user = db.query(User).filter(User.id == user_uuid).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Người dùng không tồn tại trong hệ thống",
        )
    
    return user


@router.post("/register", response_model=APIResponse[AuthTokenResponse])
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Đăng ký tài khoản người dùng mới và lưu vào cơ sở dữ liệu PostgreSQL."""
    email_clean = str(req.email).lower().strip()
    
    # Kiểm tra trùng email
    existing_user = db.query(User).filter(User.email == email_clean).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Địa chỉ email này đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập."
        )
    
    # Tạo user mới với mật khẩu mã hóa bcrypt
    new_user = User(
        id=uuid.uuid4(),
        email=email_clean,
        password_hash=hash_password(req.password),
        full_name=req.full_name.strip() if req.full_name else email_clean.split("@")[0]
    )
    db.add(new_user)
    db.flush()

    # Tự động khởi tạo danh mục mẫu cơ bản cho người dùng mới
    default_categories = [
        {"name": "Ăn uống & Cà phê", "type": "EXPENSE", "icon": "🍲", "color": "bg-amber-500"},
        {"name": "Di chuyển & Xăng xe", "type": "EXPENSE", "icon": "🚗", "color": "bg-blue-500"},
        {"name": "Mua sắm", "type": "EXPENSE", "icon": "🛍️", "color": "bg-purple-500"},
        {"name": "Hóa đơn & Tiện ích", "type": "EXPENSE", "icon": "⚡", "color": "bg-teal-500"},
        {"name": "Lương & Thu nhập", "type": "INCOME", "icon": "💵", "color": "bg-emerald-500"},
        {"name": "Thưởng & Dự án ngoài", "type": "INCOME", "icon": "🎁", "color": "bg-indigo-500"},
    ]
    for cat in default_categories:
        db.add(Category(
            id=uuid.uuid4(),
            user_id=new_user.id,
            name=cat["name"],
            type=cat["type"],
            icon=cat["icon"],
            color=cat["color"],
            is_default=True
        ))

    # Tự động tạo Ví mặc định ban đầu
    db.add(Wallet(
        id=uuid.uuid4(),
        user_id=new_user.id,
        name="Ví tiền mặt",
        balance=Decimal("0"),
        currency="VND"
    ))

    db.commit()
    db.refresh(new_user)

    # Sinh JWT token phiên đăng nhập
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
        message="Đăng ký tài khoản thành công! Chào mừng bạn đến với Budgetly."
    )


@router.post("/login", response_model=APIResponse[AuthTokenResponse])
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Đăng nhập tài khoản, xác thực mật khẩu từ PostgreSQL và trả về JWT token."""
    email_clean = str(req.email).lower().strip()
    
    user = db.query(User).filter(User.email == email_clean).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác. Vui lòng thử lại."
        )

    # Sinh JWT Token
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
        message="Đăng nhập thành công!"
    )


@router.get("/me", response_model=APIResponse[UserResponse])
def get_me(current_user: User = Depends(get_current_user)):
    """Lấy thông tin người dùng từ phiên đăng nhập hiện tại (JWT token)."""
    return APIResponse(
        data=UserResponse(
            id=str(current_user.id),
            email=current_user.email,
            full_name=current_user.full_name,
            created_at=current_user.created_at
        ),
        message="Lấy thông tin phiên người dùng thành công"
    )
