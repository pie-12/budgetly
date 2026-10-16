import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
import bcrypt
import jwt

SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_jwt_key_budgetly_2026_change_in_prod")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

def _resolve_expire_days() -> int:
    """Login sessions default to 30 days so users don't re-authenticate on every visit.

    `ACCESS_TOKEN_EXPIRE_MINUTES` is still honoured for older `.env` files, but
    `ACCESS_TOKEN_EXPIRE_DAYS` is the documented variable and wins when both are set.
    """
    days = os.getenv("ACCESS_TOKEN_EXPIRE_DAYS")
    if days:
        return max(1, int(days))
    minutes = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
    if minutes:
        return max(1, round(int(minutes) / (60 * 24)))
    return 30

ACCESS_TOKEN_EXPIRE_DAYS = _resolve_expire_days()

def hash_password(password: str) -> str:
    """Securely hash a password using bcrypt."""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check whether the plaintext password matches the hash."""
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_access_token(data: dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Generate a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict[str, Any]]:
    """Decode and validate the JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except (jwt.PyJWTError, Exception):
        return None
