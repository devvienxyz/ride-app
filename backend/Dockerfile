FROM python:3.12-slim-buster AS base

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# base deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# install dev deps if flag is set
ARG INSTALL_DEV=false
COPY requirements-dev.txt ./
RUN if [ "$INSTALL_DEV" = "true" ]; then pip install -r requirements-dev.txt; fi

COPY . .
