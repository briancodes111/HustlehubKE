from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ── Shared base (fields common to create & read) ──────────────────────────────
class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(
        min_length=3,
        max_length=50,
        pattern=r"^[a-zA-Z0-9_-]+$",   # alphanumeric, underscore, hyphen only
        examples=["john_doe"],
    )


# ── POST /auth/register ───────────────────────────────────────────────────────
class UserCreate(UserBase):
    password: str = Field(
        min_length=8,
        max_length=128,
        description="Must be at least 8 characters",
    )


# ── PATCH /users/{id} ─────────────────────────────────────────────────────────
class UserUpdate(BaseModel):
    email: EmailStr | None = None
    username: str | None = Field(
        default=None,
        min_length=3,
        max_length=50,
        pattern=r"^[a-zA-Z0-9_-]+$",
    )
    password: str | None = Field(default=None, min_length=8, max_length=128)


# ── Response returned to the client (no sensitive fields) ────────────────────
class UserRead(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime

    # orm_mode=True lets Pydantic read SQLAlchemy model instances directly
    model_config = ConfigDict(from_attributes=True)