"""add interjection to part_of_speech enum

Revision ID: e1f2a3b4c5d6
Revises: c4f2e1a0b3d5
Create Date: 2026-05-21

"""
from typing import Sequence, Union

from alembic import op

revision: str = 'e1f2a3b4c5d6'
down_revision: Union[str, None] = 'c4f2e1a0b3d5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE partofspeech ADD VALUE IF NOT EXISTS 'interjection'")


def downgrade() -> None:
    pass
