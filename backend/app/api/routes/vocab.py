import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.api.schemas import AddWordRequest, VocabWord
from app.db import get_db
from app.models import KnownVocab, User, WantToLearn

router = APIRouter(prefix="/vocab", tags=["vocab"])


@router.post("/known", response_model=VocabWord)
def add_known_word(word: AddWordRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    entry = KnownVocab(id=uuid.uuid4(), user_id=user.id, french_word=word.french_word)
    db.add(entry)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Word already exists")
    db.refresh(entry)
    return entry


@router.delete("/known/{word_id}", status_code=204)
def delete_known_word(word_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    entry = db.query(KnownVocab).filter(KnownVocab.id == word_id, KnownVocab.user_id == user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(entry)
    db.commit()


@router.post("/want-to-learn", response_model=VocabWord)
def add_want_to_learn_word(word: AddWordRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    entry = WantToLearn(id=uuid.uuid4(), user_id=user.id, french_word=word.french_word)
    db.add(entry)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Word already exists")
    db.refresh(entry)
    return entry


@router.delete("/want-to-learn/{word_id}", status_code=204)
def delete_want_to_learn_word(word_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    entry = db.query(WantToLearn).filter(WantToLearn.id == word_id, WantToLearn.user_id == user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(entry)
    db.commit()
