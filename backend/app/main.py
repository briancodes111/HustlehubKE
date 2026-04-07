from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth_router, users_router
from .config import settings
from .routers import auth_router, users_router


# ── Create all tables on startup (development convenience) ────────────────────
# In production, use Alembic migrations instead.
Base.metadata.create_all(bind=engine)

# ── App instance ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="HUSTLEHUBKE",
    description="The backend API powering HUSTLEHUBKE — Kenya's hustle marketplace.",
    version="1.0.0",
    # Disable docs in production by setting docs_url/redoc_url to None
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# ── CORS middleware ───────────────────────────────────────────────────────────
# Only the origins listed in .env are allowed to make cross-origin requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,     # Required for cookies / Authorization headers
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(users_router)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health_check():
    """Used by deployment platforms to verify the service is running."""
    return {"status": "ok", "app": settings.APP_NAME}