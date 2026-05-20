import uuid

from fastapi import Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User

DEFAULT_USER_EMAIL = "default@parlez.dev"


def get_current_user(db: Session = Depends(get_db)) -> User:
    user = db.query(User).filter(User.email == DEFAULT_USER_EMAIL).first()
    if not user:
        user = User(
            id=uuid.uuid4(),
            email=DEFAULT_USER_EMAIL,
            name="Default User",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
