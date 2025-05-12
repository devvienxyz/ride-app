#!/bin/bash

# Exit immediately on error
set -e

# Get environment from second argument (default: dev)
ENV=${2:-dev}
COMPOSE_FILE="docker-compose.${ENV}.yml"

# Ensure COMPOSE_FILE exists
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Error: $COMPOSE_FILE not found!"
  exit 1
fi

# Function to check if a Python package is installed in the backend container
check_be_package_installed() {
  MODULE=$1

  if [ -z "$MODULE" ]; then
    echo "Please provide a Python package name to check."
    exit 1
  fi

  echo "Checking if Python package '$MODULE' is installed in the 'backend' container..."

  docker compose -f "$COMPOSE_FILE" exec backend pip freeze | grep "$MODULE" || \
  echo "Python package '$MODULE' is not installed in the 'backend' container."
}

# Function to rebuild any container (can be used dynamically for any service)
rebuild_container() {
  SERVICE=$1
  echo "Rebuilding the '$SERVICE' container..."
  docker compose -f "$COMPOSE_FILE" build --no-cache "$SERVICE"
}

# Function to view logs for any service
logs_service() {
  SERVICE=$1
  echo "Viewing logs for the '$SERVICE' service..."
  docker compose -f "$COMPOSE_FILE" logs -f "$SERVICE"
}

# Main command dispatcher
case "$1" in
  up)
    # Start containers in detached mode (background)
    docker compose -f "$COMPOSE_FILE" up -d
    ;;
  up-build)
    # Rebuild images and start containers in detached mode
    docker compose -f "$COMPOSE_FILE" up --build -d
    ;;
  down)
    # Stop and remove containers, volumes, and orphans
    docker compose -f "$COMPOSE_FILE" down -v --remove-orphans
    ;;
  stop)
    # Gracefully stop containers without removing them
    docker compose -f "$COMPOSE_FILE" stop
    ;;
  ps)
    # Show status of containers
    docker compose -f "$COMPOSE_FILE" ps
    ;;
  logs-all)
    # Tail logs for all containers
    docker compose -f "$COMPOSE_FILE" logs -f
    ;;
  logs-be)
    # Tail logs for the backend container
    docker compose -f "$COMPOSE_FILE" logs -f backend
    ;;
  logs-fe)
    # Tail logs for the frontend container
    docker compose -f "$COMPOSE_FILE" logs -f frontend
    ;;
  bash)
    # Open interactive shell in the 'backend' container
    docker compose -f "$COMPOSE_FILE" exec backend sh
    ;;
  shell)
    # Launch Django shell inside the 'backend' container
    docker compose -f "$COMPOSE_FILE" exec backend python manage.py shell
    ;;
  check-be-package)
    # Check if a specific Python package is installed in the backend container
    check_be_package_installed "$3"
    ;;
  rebuild)
    # Rebuild a specific service container
    rebuild_container "$2"
    ;;
  *)
    # Default help message if an unknown command is passed
    echo "Usage: $0 {up|up-build|down|stop|ps|logs-all|logs-be|logs-fe|bash|shell|check-be-package|rebuild} [dev|prod] [additional arguments]"
    exit 1
    ;;
esac
