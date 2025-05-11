# [ride-app](https://github.com/devvienxyz/ride-app)

A full-stack ride-sharing application built with Django (backend), Vite + React (frontend), Docker, and PostgreSQL.

## Tech Stack

- Backend: Django + Django REST Framework

- Frontend: Vite + React

- Database: PostgreSQL

- Containerization: Docker + Docker Compose

- Testing: tox, pytest, coverage

- Dev Tools: Pre-commit, linters, formatters

- Other Tools: DBeaver

## Quick Start

### With Docker (recommended)

Development

```bash
./docker.sh up-build dev
```

Production

```bash
./docker.sh up-build prod
```

## Manual Setup (dev mode only)

If running both apps manually,

```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

Frontend runs with

```bash
cd frontend
npm ci
npm run dev
```

## Testing

```bash
# test everything
tox

# run a single test (run lint, unit test)
tox -- backend/ride/tests/test_views.py::test_rides_accessible_to_admin_only

# run only the unit test, no lint
tox -e py12 -- backend/ride/tests/test_views.py::test_rides_accessible_to_admin_only
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
