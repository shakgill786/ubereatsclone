"""create reviews table

Revision ID: fba849bac8ba
Revises: 9d7c967266ed
Create Date: 2025-04-02 21:46:26.515678
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'fba849bac8ba'
down_revision = '9d7c967266ed'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'reviews',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('comment', sa.String(length=255), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('restaurant_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['restaurant_id'], ['restaurants.id'], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete="CASCADE"),
    )

def downgrade():
    op.drop_table('reviews')
