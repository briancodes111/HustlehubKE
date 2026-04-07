from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings


# ── Engine ────────────────────────────────────────────────────────────────────
# connect_args is only needed for SQLite. For PostgreSQL it can stay empty.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,   # Reconnects stale connections automatically
    pool_size=10,         # Number of persistent connections in the pool
    max_overflow=20,      # Extra connections allowed under load
)

# ── Session factory ───────────────────────────────────────────────────────────
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ── Base class for all ORM models ─────────────────────────────────────────────
class Base(DeclarativeBase):
    pass


# ── Dependency injected into every route that needs DB access ─────────────────
def get_db():
    """
    Yields a database session and guarantees it is closed after the request,
    even if an exception is raised.

    Usage in a router:
        @router.get("/")
        def my_route(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()