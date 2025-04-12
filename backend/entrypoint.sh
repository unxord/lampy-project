#!/bin/sh

echo "В ожидании Postgres..."

while ! nc -z db 5432; do
  sleep 0.1
done

echo "PostgreSQL запущен"

echo "Применение миграций базы данных..."
python manage.py migrate --noinput

echo "Запуск Daphne ASGI сервера..."
daphne -b 0.0.0.0 -p 8000 lampy_backend.asgi:application