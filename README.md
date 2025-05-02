# [ride-app](https://github.com/devvienxyz/ride-app)

## Setup

No need to setup long if Docker is used.

## Development

```bash
docker compose up --build
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
