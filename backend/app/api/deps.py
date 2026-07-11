import secrets
import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.config import get_api_key
from app.db import get_db
from app.models import User

security = HTTPBearer()

DEFAULT_USER_EMAIL = "default@parlez.dev"


def require_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)) -> None:
    if not secrets.compare_digest(credentials.credentials, get_api_key()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")


def get_current_user(_: None = Depends(require_api_key), db: Session = Depends(get_db)) -> User:
    user = db.query(User).filter(User.email == DEFAULT_USER_EMAIL).first()
    if not user:
        user = User(id=uuid.uuid4(), email=DEFAULT_USER_EMAIL, name="Default User")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user