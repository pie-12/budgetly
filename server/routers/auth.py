from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.db.session import get_db
from server.models.user import User
from server.schemas.common import APIResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/me", response_model=APIResponse[dict])
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@budgetly.app").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return APIResponse(
        data={
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "created_at": user.created_at.isoformat()
        },
        message="User profile fetched successfully"
    )

@router.post("/login", response_model=APIResponse[dict])
def login():
    return APIResponse(
        data={
            "token": "budgetly_demo_jwt_token_2026",
            "token_type": "bearer",
            "expires_in": 86400
        },
        message="Login successful"
    )
