import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://budgetly_user:budgetly_secure_password_2026@localhost:5432/budgetly_db")
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

DATABASE_FALLBACK = False

try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args=connect_args)
    # Test connection
    with engine.connect() as conn:
        pass
except Exception as e:
    logger.warning(f"Could not connect to PostgreSQL ({DATABASE_URL}): {e}. Falling back to SQLite for local development.")
    DATABASE_URL = "sqlite:///./budgetly.db"
    connect_args = {"check_same_thread": False}
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
    DATABASE_FALLBACK = True

# Dialect actually serving the API right now ("postgresql" or "sqlite").
DB_DIALECT = engine.dialect.name

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def check_database() -> bool:
    """Ping the active database so health checks report the real connection state."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        logger.exception("Database health probe failed")
        return False

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
