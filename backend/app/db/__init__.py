from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import get_database_url


@lru_cache
def _get_session_factory():
    engine = create_engine(get_database_url())
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = _get_session_factory()()
    try:
        yield db
    finally:
        db.close()
