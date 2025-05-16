# [ride-app](https://github.com/devvienxyz/ride-app)

A full-stack ride-sharing application built with Django (backend), Vite + React (frontend), Docker, and PostgreSQL.

[![codecov](https://codecov.io/gh/devvienxyz/ride-app/branch/main/graph/badge.svg)](https://codecov.io/gh/devvienxyz/ride-app)

## Tech Stack

- Backend: Django + Django REST Framework

- Frontend: Vite + React

- Database: PostgreSQL

- Containerization: Docker + Docker Compose

- Testing: tox, pytest, coverage

- Dev Tools: Pre-commit, linters, formatters

- Other Tools: DBeaver

## Quick Start

### 1. Set up environment variables

Create a copy of `backend/.env.template` and rename the new file to `.env`.

Change the environment values accordingly.

### 2. Build the docker containers

```bash
# run on development mode
./docker.sh up-build dev
```

## Making Fixtures

```bash
python manage.py generate_users_app_fixtures --riders 15 --drivers 8 --password <securepasswordhere>
```

## Testing

```bash
# test everything
tox

# run a single test (run lint, unit test)
tox -- backend/ride/tests/test_views.py::test_rides_accessible_to_admin_only

# run only the unit test, no lint
tox -e py12 -- backend/ride/tests/test_views.py::test_rides_accessible_to_admin_only

# Tracebacks
# note: the -- separates pytest args from tox args

# --tb=short: compact tracebacks
tox -e py12 -- --tb=short

# --tb=auto: smart formatting
tox -e py12 -- --tb=auto

# --tb=line: one-line tracebacks
tox -e py12 -- --tb=line

# --tb=no: disables tracebacks (only shows error summary)
tox -e py12 -- --tb=no

# -q: quiet output
tox -e py12 -- -q
```

## Other django commands

```bash
# list all generated route names
python manage.py show_urls
```


## Other docker script commands

```bash
# Start dev environment in background
./docker.sh up dev

# Tail logs for dev
./docker.sh logs dev

# Rebuild and start prod
./docker.sh up-build prod
 
# Exec into prod backend container
./docker.sh bash prod
# stop 
```

Check `docker.sh` for more commands.

## Additional Documentation

The API documentation can be accessed via `http://localhost:8000/api/docs/`. Note that this is only available on **DEVELOPMENT** mode.

Go to `http://localhost:8000/api/schema/` to download the API Schema in OpenAPI format.

Miscellaneous documentation is available in the `/docs/` directory:

- **postgresql.md**: Local PostgreSQL setup

- **tools.md**: Overview of tools and services used in the project

Refer to these files for deeper configuration notes and development context.
