# Dockerfile
FROM python:3.9.18-alpine3.18

RUN apk add build-base postgresql-dev gcc python3-dev musl-dev

ENV FLASK_APP=app
ENV FLASK_ENV=development
ENV FLASK_DEBUG=1
ENV SECRET_KEY=dev

WORKDIR /var/www

COPY requirements.txt .

RUN pip install -r requirements.txt && pip install psycopg2

COPY . .

EXPOSE 8000

CMD flask db upgrade && flask seed all && gunicorn -b 0.0.0.0:8000 app:app
