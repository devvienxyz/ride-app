# [ride-app](https://github.com/devvienxyz/ride-app)

## Setup

No need to setup long if Docker is used.

## Development

```bash
docker compose -f docker-compose.dev.yml up --build
```

If running both apps manually,

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt

```

## Testing

```bash
tox
```

## Production

```bash
docker compose -f docker-compose.prod.yml up --build
```
