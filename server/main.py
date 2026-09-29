from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.db.init_db import init_db
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
def health_check():
    return {
        "status": "ok",
        "service": "budgetly-core",
        "database": "connected"
    }
