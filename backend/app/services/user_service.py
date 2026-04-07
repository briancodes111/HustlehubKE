from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.auth.auth_handler import hash_password, verify_password, create_access_token


class UserService:
    """
    All user-related business logic lives here.
    Routers call these methods — they never touch the DB directly.
    This separation makes the code easy to test and maintain.
    """

    # ── Read operations ───────────────────────────────────────────────────────

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> User:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found",
            )
        return user

    @staticmethod
    def get_by_email(db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_by_username(db: Session, username: str) -> User | None:
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """Return a paginated list of all users (superuser only)."""
        return db.query(User).offset(skip).limit(limit).all()

    # ── Write operations ──────────────────────────────────────────────────────

    @staticmethod
    def create(db: Session, user_in: UserCreate) -> User:
        """
        Register a new user.
        Raises 400 if the email or username is already taken.
        """
        if UserService.get_by_email(db, user_in.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        if UserService.get_by_username(db, user_in.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken",
            )

        db_user = User(
            email=user_in.email,
            username=user_in.username,
            hashed_password=hash_password(user_in.password),
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def update(db: Session, user_id: int, user_in: UserUpdate) -> User:
        """Partially update a user's profile."""
        db_user = UserService.get_by_id(db, user_id)
        update_data = user_in.model_dump(exclude_unset=True)

        # Hash the new password before saving if it was provided
        if "password" in update_data:
            update_data["hashed_password"] = hash_password(update_data.pop("password"))

        for field, value in update_data.items():
            setattr(db_user, field, value)

        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def delete(db: Session, user_id: int) -> None:
        db_user = UserService.get_by_id(db, user_id)
        db.delete(db_user)
        db.commit()

    # ── Auth operations ───────────────────────────────────────────────────────

    @staticmethod
    def authenticate(db: Session, email: str, password: str) -> str:
        """
        Validate credentials and return a JWT access token.
        Raises 401 on invalid email or wrong password.
        """
        user = UserService.get_by_email(db, email)

        # Use a single generic error message to prevent user enumeration
        auth_error = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

        if not user:
            raise auth_error
        if not verify_password(password, user.hashed_password):
            raise auth_error
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated",
            )

        token = create_access_token(
            data={"sub": str(user.id), "username": user.username}
        )
        return token