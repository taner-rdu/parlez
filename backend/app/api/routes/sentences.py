import json

import anthropic
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.api.schemas import (
    SentenceCheckRequest,
    SentenceCheckResponse,
    SentenceGenerateRequest,
    SentenceGenerateResponse,
)
from app.db import get_db
from app.models import KnownVocab, User

router = APIRouter(prefix="/sentences", tags=["sentences"])
_claude = anthropic.Anthropic()


def _parse_json(text: str):
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


@router.post("/generate", response_model=SentenceGenerateResponse)
def generate_sentences(
    request: SentenceGenerateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    vocab_hint = ""
    if request.use_known_words_only:
        words = [
            w.french_word
            for w in db.query(KnownVocab).filter(KnownVocab.user_id == user.id).all()
        ]
        if words:
            vocab_hint = f"\n\nKnown French vocabulary: {', '.join(words)}\nDesign sentences whose French translations primarily use these words."

    prompt = f"""Generate exactly 10 English sentences for French translation practice.

Topic: {request.topic}
CEFR Level: {request.level}{vocab_hint}

- Appropriate complexity for {request.level}
- All related to the topic
- Varied sentence structures

Respond with a JSON array of exactly 10 strings, nothing else:
["sentence 1", "sentence 2", ..., "sentence 10"]"""

    try:
        message = _claude.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )
    except anthropic.APIStatusError:
        raise HTTPException(
            status_code=503, detail="AI service temporarily unavailable, please try again"
        )

    sentences = _parse_json(message.content[0].text.strip())
    return SentenceGenerateResponse(sentences=sentences)


@router.post("/check", response_model=SentenceCheckResponse)
def check_translation(request: SentenceCheckRequest):
    prompt = f"""You are a French language teacher evaluating a student's translation.

English sentence: {request.english_sentence}
Student's French translation: {request.user_translation}

Score the student's translation from 0 to 100 (100 = perfectly correct, allowing for acceptable synonyms and minor style variants).
Also provide the ideal correct French translation.

Respond with JSON only:
{{
  "score": <integer 0-100>,
  "correct_translation": "<ideal French translation>"
}}"""

    try:
        message = _claude.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            messages=[{"role": "user", "content": prompt}],
        )
    except anthropic.APIStatusError:
        raise HTTPException(
            status_code=503, detail="AI service temporarily unavailable, please try again"
        )

    data = _parse_json(message.content[0].text.strip())
    return SentenceCheckResponse(
        score=data["score"], correct_translation=data["correct_translation"]
    )
