from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserRead
from app.schemas.token import Token
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user account.

    - **email**: must be a valid, unique email address
    - **username**: 3-50 alphanumeric characters (underscores and hyphens allowed)
    - **password**: minimum 8 characters
    """
    return UserService.create(db, user_in)


@router.post(
    "/login",
    response_model=Token,
    summary="Login and receive a JWT",
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Login using email (sent as `username` in the form) and password.
    Returns a JWT bearer token valid for the configured duration.
    """
    # OAuth2PasswordRequestForm uses `username` field — we treat it as email
    token = UserService.authenticate(db, form_data.username, form_data.password)
    return Token(access_token=token)