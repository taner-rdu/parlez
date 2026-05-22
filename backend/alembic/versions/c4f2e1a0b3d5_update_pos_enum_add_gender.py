"""update part_of_speech enum and add gender column

Revision ID: c4f2e1a0b3d5
Revises: 981397dd5e69
Create Date: 2026-05-21

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'c4f2e1a0b3d5'
down_revision: Union[str, Sequence[str], None] = '981397dd5e69'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

old_enum = sa.Enum('noun', 'verb', 'adjective', 'adverb', 'pronoun', 'determiner', 'other', name='partofspeech')
new_enum = sa.Enum('noun', 'article', 'adverb', 'pronoun', 'adjective', 'verb', 'question_word', 'preposition', 'contraction', 'demonstrative', 'connector', name='partofspeech')


def upgrade() -> None:
    op.drop_column('known_vocab', 'part_of_speech')
    op.drop_column('want_to_learn', 'part_of_speech')
    old_enum.drop(op.get_bind())
    new_enum.create(op.get_bind())
    op.add_column('known_vocab', sa.Column('part_of_speech', new_enum, nullable=True))
    op.add_column('want_to_learn', sa.Column('part_of_speech', new_enum, nullable=True))
    op.add_column('known_vocab', sa.Column('gender', sa.String(), nullable=True))
    op.add_column('want_to_learn', sa.Column('gender', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('want_to_learn', 'gender')
    op.drop_column('known_vocab', 'gender')
    op.drop_column('want_to_learn', 'part_of_speech')
    op.drop_column('known_vocab', 'part_of_speech')
    new_enum.drop(op.get_bind())
    old_enum.create(op.get_bind())
    op.add_column('known_vocab', sa.Column('part_of_speech', old_enum, nullable=True))
    op.add_column('want_to_learn', sa.Column('part_of_speech', old_enum, nullable=True))
