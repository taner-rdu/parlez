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


class SentenceGenerateRequest(BaseModel):
    topic: str
    level: str
    use_known_words_only: bool = False
    use_want_to_learn_words: bool = False
    tenses: list[str] = []


class SentenceGenerateResponse(BaseModel):
    sentences: list[str]


class SentenceCheckRequest(BaseModel):
    english_sentence: str
    user_translation: str


class SentenceCheckResponse(BaseModel):
    score: int
    correct_translation: str
    explanation: str


class AddWordRequest(BaseModel):
    french_word: str


class VocabWord(BaseModel):
    id: uuid.UUID
    french_word: str
    part_of_speech: PartOfSpeech | None
    created_at: datetime
    gender: str | None

    model_config = ConfigDict(from_attributes=True)
