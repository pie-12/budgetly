from contextlib import asynccontextmanager
from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from server.db.init_db import init_db
from server.db.session import DB_DIALECT, DATABASE_FALLBACK, check_database
from server.routers import (
    auth,
    wallets,
    categories,
    transactions,
    budgets,
    analytics,
    ai,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB & Seed baseline data on startup
    init_db()
    yield

app = FastAPI(
    title="Budgetly Core API",
    version="1.0.0",
    description="RESTful API for Budgetly - AI-powered Smart Personal Financial Management Platform",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
API_V1_PREFIX = "/api/v1"
app.include_router(auth.router, prefix=API_V1_PREFIX)
app.include_router(wallets.router, prefix=API_V1_PREFIX)
app.include_router(categories.router, prefix=API_V1_PREFIX)
app.include_router(transactions.router, prefix=API_V1_PREFIX)
app.include_router(budgets.router, prefix=API_V1_PREFIX)
app.include_router(analytics.router, prefix=API_V1_PREFIX)
app.include_router(ai.router, prefix=API_V1_PREFIX)

@app.get("/")
def read_root():
    return {
        "project": "Budgetly",
        "description": "Smart Personal Financial Management Platform",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/api/v1/health")
def health_check(response: Response):
    """Liveness/readiness probe.

    Pings the database on every call and returns HTTP 503 when it is unreachable,
    so orchestrators (Docker Compose healthcheck, load balancers) can react.
    """
    database_reachable = check_database()
    if not database_reachable:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return {
        "status": "ok" if database_reachable else "degraded",
        "service": "budgetly-core",
        "version": app.version,
        "database": {
            "status": "connected" if database_reachable else "unreachable",
            "dialect": DB_DIALECT,
            "fallback": DATABASE_FALLBACK,
        }
    }
