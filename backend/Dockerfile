FROM python:3.12.10-alpine AS base

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# system deps
RUN apk update && apk add --no-cache postgresql-client

# base deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# install dev deps if flag is set
ARG INSTALL_DEV=false
COPY requirements-dev.txt ./
RUN if [ "$INSTALL_DEV" = "true" ]; then pip install -r requirements-dev.txt; fi

COPY . .
