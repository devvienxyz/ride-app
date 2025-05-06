FROM python:3.12-slim
WORKDIR /app

# base deps
COPY requirements.txt .
RUN pip install -r requirements.txt

# install dev deps if flag is set
ARG INSTALL_DEV=false
COPY requirements-dev.txt ./
RUN if [ "$INSTALL_DEV" = "true" ]; then pip install -r requirements-dev.txt; fi

COPY . .
