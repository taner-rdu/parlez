import os
from functools import lru_cache

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv(os.path.join(os.path.dirname(__file__), "../../../.env"))


@lru_cache
def _get_session_factory():
    engine = create_engine(os.environ["DATABASE_URL"])
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = _get_session_factory()()
    try:
        yield db
    finally:
        db.close()
