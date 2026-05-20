import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class PartOfSpeech(str, enum.Enum):
    noun = "noun"
    verb = "verb"
    adjective = "adjective"
    adverb = "adverb"
    pronoun = "pronoun"
    determiner = "determiner"
    other = "other"


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    google_sub: Mapped[str | None] = mapped_column(String, unique=True, nullable=True)
    name: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    want_to_learn: Mapped[list["WantToLearn"]] = relationship(back_populates="user")
    known_vocab: Mapped[list["KnownVocab"]] = relationship(back_populates="user")


class WantToLearn(Base):
    __tablename__ = "want_to_learn"
    __table_args__ = (UniqueConstraint("user_id", "french_word"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    french_word: Mapped[str] = mapped_column(String, nullable=False)
    part_of_speech: Mapped[PartOfSpeech | None] = mapped_column(Enum(PartOfSpeech), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="want_to_learn")


class KnownVocab(Base):
    __tablename__ = "known_vocab"
    __table_args__ = (UniqueConstraint("user_id", "french_word"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    french_word: Mapped[str] = mapped_column(String, nullable=False)
    part_of_speech: Mapped[PartOfSpeech | None] = mapped_column(Enum(PartOfSpeech), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="known_vocab")
