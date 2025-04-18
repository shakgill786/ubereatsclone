import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    FLASK_RUN_PORT = os.environ.get('FLASK_RUN_PORT')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True

    # Fix for Heroku / Render postgres URI
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL').replace('postgres://', 'postgresql://')

    # ✅ Add schema search_path in production
    if os.getenv("FLASK_ENV") == "production":
        SCHEMA = os.environ.get("SCHEMA")
        SQLALCHEMY_ENGINE_OPTIONS = {
            "connect_args": {
                "options": f"-c search_path={SCHEMA},public"
            }
        }
