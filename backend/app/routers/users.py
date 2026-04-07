from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserRead, UserUpdate
from app.services.user_service import UserService
from app.auth.dependencies import get_current_active_user, get_current_superuser
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    response_model=UserRead,
    summary="Get your own profile",
)
def read_me(current_user: User = Depends(get_current_active_user)):
    """Return the profile of the currently authenticated user."""
    return current_user


@router.patch(
    "/me",
    response_model=UserRead,
    summary="Update your own profile",
)
def update_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Partially update the current user's profile (email, username, or password)."""
    return UserService.update(db, current_user.id, user_in)


@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete your own account",
)
def delete_me(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Permanently delete the current user's account."""
    UserService.delete(db, current_user.id)


# ── Admin-only routes (require is_superuser=True) ─────────────────────────────

@router.get(
    "/",
    response_model=list[UserRead],
    summary="[Admin] List all users",
)
def list_users(
    skip: int = 0,
    limit: int = 100,
    _: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
):
    """Return a paginated list of all users. Superuser only."""
    return UserService.get_all(db, skip=skip, limit=limit)


@router.get(
    "/{user_id}",
    response_model=UserRead,
    summary="[Admin] Get user by ID",
)
def read_user(
    user_id: int,
    _: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
):
    """Return a specific user by their ID. Superuser only."""
    return UserService.get_by_id(db, user_id)


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="[Admin] Delete user by ID",
)
def delete_user(
    user_id: int,
    _: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
):
    """Delete any user by ID. Superuser only."""
    UserService.delete(db, user_id)