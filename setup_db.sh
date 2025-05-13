#!/bin/bash

# Sample usage
# ./setup_db.sh dev "password_here"

set -euo pipefail

# --- Validate input ---
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <dev|prod> <db_password>"
  exit 1
fi

ENV_MODE=$1
DB_PASS=$2

# --- Validate env mode ---
if [[ "$ENV_MODE" != "dev" && "$ENV_MODE" != "prod" ]]; then
  echo "Error: ENV_MODE must be 'dev' or 'prod'"
  exit 1
fi

# --- Check for psql ---
if ! command -v psql &> /dev/null; then
  echo "Error: psql is not installed or not in PATH."
  echo "Install it with: sudo apt install postgresql-client (Debian/Ubuntu) or brew install libpq (macOS)"
  exit 1
fi

DB_NAME="${ENV_MODE}_ride_app"
DB_USER="${ENV_MODE}_admin_ride_app"

# --- Create DB and User ---
psql -v ON_ERROR_STOP=1 -U postgres <<-EOSQL
  DO \$\$
  BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = '${DB_USER}') THEN
      CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}') THEN
      CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
    END IF;
  END
  \$\$;

  ALTER ROLE ${DB_USER} SET client_encoding TO 'utf8';
  ALTER ROLE ${DB_USER} SET default_transaction_isolation TO 'read committed';
  ALTER ROLE ${DB_USER} SET timezone TO 'UTC';

  GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
EOSQL

echo "✅ Database '${DB_NAME}' and user '${DB_USER}' setup complete."
