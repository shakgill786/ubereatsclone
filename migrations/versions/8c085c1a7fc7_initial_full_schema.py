"""initial full schema

Revision ID: 8c085c1a7fc7
Revises: 
Create Date: 2025-04-14 12:11:43.608815
"""

from alembic import op
import sqlalchemy as sa
import os

# revision identifiers, used by Alembic.
revision = '8c085c1a7fc7'
down_revision = None
branch_labels = None
depends_on = None

environment = os.getenv("FLASK_ENV")
SCHEMA = os.getenv("SCHEMA")

def upgrade():
    schema_args = {"schema": SCHEMA} if environment == "production" else {}

    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=40), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username'),
        **schema_args
    )

    op.create_table('restaurants',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('address', sa.String(length=255), nullable=False),
        sa.Column('cuisine', sa.String(length=100), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], [f"{SCHEMA}.users.id"] if environment == "production" else ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        **schema_args
    )

    op.create_table('favorites',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('restaurant_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], [f"{SCHEMA}.users.id"] if environment == "production" else ['users.id']),
        sa.ForeignKeyConstraint(['restaurant_id'], [f"{SCHEMA}.restaurants.id"] if environment == "production" else ['restaurants.id']),
        sa.PrimaryKeyConstraint('id'),
        **schema_args
    )

    op.create_table('menu_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('image_url', sa.String(length=255), nullable=False),
        sa.Column('restaurant_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['restaurant_id'], [f"{SCHEMA}.restaurants.id"] if environment == "production" else ['restaurants.id']),
        sa.PrimaryKeyConstraint('id'),
        **schema_args
    )

    op.create_table('reviews',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('comment', sa.String(length=255), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('restaurant_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['restaurant_id'], [f"{SCHEMA}.restaurants.id"] if environment == "production" else ['restaurants.id']),
        sa.ForeignKeyConstraint(['user_id'], [f"{SCHEMA}.users.id"] if environment == "production" else ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        **schema_args
    )

    op.create_table('cart_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('menu_item_id', sa.Integer(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], [f"{SCHEMA}.users.id"] if environment == "production" else ['users.id']),
        sa.ForeignKeyConstraint(['menu_item_id'], [f"{SCHEMA}.menu_items.id"] if environment == "production" else ['menu_items.id']),
        sa.PrimaryKeyConstraint('id'),
        **schema_args
    )


def downgrade():
    schema = SCHEMA if environment == "production" else None
    op.drop_table('cart_items', schema=schema)
    op.drop_table('reviews', schema=schema)
    op.drop_table('menu_items', schema=schema)
    op.drop_table('favorites', schema=schema)
    op.drop_table('restaurants', schema=schema)
    op.drop_table('users', schema=schema)
