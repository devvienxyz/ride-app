FROM python:3.12.10-alpine AS base

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# system deps
RUN apk update && apk add --no-cache postgresql-client

# base deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# --- Development Stage ---
FROM base AS development

WORKDIR /app

# Copy deps and source from build stage
COPY --from=base /app /app

COPY requirements-dev.txt .

RUN pip install --no-cache-dir -r requirements-dev.txt

COPY . .
