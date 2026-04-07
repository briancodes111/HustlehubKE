from pydantic import BaseModel


class Token(BaseModel):
    """Returned to the client after a successful login."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Decoded payload stored inside the JWT."""
    user_id: int | None = None
    username: str | None = None