import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models import PartOfSpeech


class TranslateRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str


class TranslateResponse(BaseModel):
    translated_text: str
    source_lang: str
    target_lang: str


class ConjugationRequest(BaseModel):
    verb: str


class ConjugationResponse(BaseModel):
    valid: bool
    error: str | None = None
    tenses: dict[str, dict[str, str]] | None = None


class AddWordRequest(BaseModel):
    french_word: str


class VocabWord(BaseModel):
    id: uuid.UUID
    french_word: str
    part_of_speech: PartOfSpeech | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
