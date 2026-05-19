#!/bin/sh
set -e

echo "=== Waiting for database to be ready ==="
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "Database is not ready yet. Waiting..."
  sleep 1
done
echo "=== Database is ready! ==="

echo "=== Running Migrations ==="
npm run migration:run

echo "=== Executing seed.sql ==="
export PGPASSWORD="$DB_PASSWORD"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f src/database/seeds/seed.sql
echo "=== seed.sql execution completed! ==="

echo "=== Starting Backend Application ==="
exec npm run start:prod
