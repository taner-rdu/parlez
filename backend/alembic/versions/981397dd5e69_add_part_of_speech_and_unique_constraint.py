"""add part_of_speech and unique constraint

Revision ID: 981397dd5e69
Revises: b6081f067a99
Create Date: 2026-05-19 22:01:09.925554

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '981397dd5e69'
down_revision: Union[str, Sequence[str], None] = 'b6081f067a99'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


part_of_speech_enum = sa.Enum('noun', 'verb', 'adjective', 'adverb', 'pronoun', 'determiner', 'other', name='partofspeech')


def upgrade() -> None:
    part_of_speech_enum.create(op.get_bind())
    op.add_column('known_vocab', sa.Column('part_of_speech', part_of_speech_enum, nullable=True))
    op.create_unique_constraint(None, 'known_vocab', ['user_id', 'french_word'])
    op.add_column('want_to_learn', sa.Column('part_of_speech', part_of_speech_enum, nullable=True))
    op.create_unique_constraint(None, 'want_to_learn', ['user_id', 'french_word'])


def downgrade() -> None:
    op.drop_constraint(None, 'want_to_learn', type_='unique')
    op.drop_column('want_to_learn', 'part_of_speech')
    op.drop_constraint(None, 'known_vocab', type_='unique')
    op.drop_column('known_vocab', 'part_of_speech')
    part_of_speech_enum.drop(op.get_bind())
