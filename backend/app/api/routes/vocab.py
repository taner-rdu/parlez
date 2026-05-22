import json
import uuid

import anthropic
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.api.schemas import AddWordRequest, VocabWord
from app.db import get_db
from app.models import KnownVocab, PartOfSpeech, User, WantToLearn

router = APIRouter(prefix="/vocab", tags=["vocab"])
_claude = anthropic.Anthropic()


def _analyse_word(raw: str) -> dict:
    prompt = f"""You are a French language expert. Analyse the French word or phrase "{raw}".

Respond with a JSON object and nothing else:
{{
  "valid": true or false,
  "base_form": "the dictionary/base form (infinitive for verbs, singular for nouns, etc.)",
  "type": one of: noun, article, adverb, pronoun, adjective, verb, question_word, preposition, contraction, demonstrative, connector,
  "gender": "masculine" or "feminine" or null (only for nouns; null for everything else),
  "article": "le" or "la" or "l'" or null (definite article for nouns; null for everything else)
}}

If the input is not a real French word, set valid to false and all other fields to null."""

    try:
        message = _claude.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            messages=[{"role": "user", "content": prompt}],
        )
    except anthropic.APIStatusError:
        raise HTTPException(status_code=503, detail="AI service temporarily unavailable, please try again")
    text = message.content[0].text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


@router.get("/known", response_model=list[VocabWord])
def list_known_words(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(KnownVocab).filter(KnownVocab.user_id == user.id).order_by(KnownVocab.created_at).all()


@router.post("/known", response_model=VocabWord)
def add_known_word(word: AddWordRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    info = _analyse_word(word.french_word)
    if not info.get("valid"):
        raise HTTPException(status_code=422, detail=f'"{word.french_word}" is not a valid French word')
    saved_word = f"{info['article']} {info['base_form']}" if info.get("article") else info["base_form"]
    pos = PartOfSpeech(info["type"]) if info.get("type") else None
    gender = info.get("gender")
    existing = db.query(WantToLearn).filter(WantToLearn.user_id == user.id, WantToLearn.french_word == saved_word).first()
    if existing:
        db.delete(existing)
    entry = KnownVocab(id=uuid.uuid4(), user_id=user.id, french_word=saved_word, part_of_speech=pos, gender=gender)
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


@router.get("/want-to-learn", response_model=list[VocabWord])
def list_want_to_learn_words(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(WantToLearn).filter(WantToLearn.user_id == user.id).order_by(WantToLearn.created_at).all()


@router.post("/want-to-learn", response_model=VocabWord)
def add_want_to_learn_word(word: AddWordRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    info = _analyse_word(word.french_word)
    if not info.get("valid"):
        raise HTTPException(status_code=422, detail=f'"{word.french_word}" is not a valid French word')
    saved_word = f"{info['article']} {info['base_form']}" if info.get("article") else info["base_form"]
    pos = PartOfSpeech(info["type"]) if info.get("type") else None
    gender = info.get("gender")
    existing = db.query(KnownVocab).filter(KnownVocab.user_id == user.id, KnownVocab.french_word == saved_word).first()
    if existing:
        db.delete(existing)
    entry = WantToLearn(id=uuid.uuid4(), user_id=user.id, french_word=saved_word, part_of_speech=pos, gender=gender)
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
