#!/bin/bash

# Exit immediately on error
set -e

# Get environment from second argument (default: dev)
ENV=${2:-dev}
COMPOSE_FILE="docker-compose.${ENV}.yml"

# Main command dispatcher
case "$1" in
  up)
    # Start containers in detached mode (background)
    docker compose -f $COMPOSE_FILE up -d
    ;;
  up-build)
    # Rebuild images and start containers in detached mode
    docker compose -f $COMPOSE_FILE up --build -d
    ;;
  down)
    # Stop and remove containers, volumes, and orphans
    docker compose -f $COMPOSE_FILE down -v --remove-orphans
    ;;
  stop)
    # Gracefully stop containers without removing them
    docker compose -f $COMPOSE_FILE stop
    ;;
  ps)
    # Show status of containers
    docker compose -f $COMPOSE_FILE ps
    ;;
  logs)
    # Tail logs for all containers
    docker compose -f $COMPOSE_FILE logs -f
    ;;
  bash)
    # Open interactive shell in the 'backend' container
    docker compose -f $COMPOSE_FILE exec backend bash
    ;;
  shell)
    # Launch Django shell inside the 'backend' container
    docker compose -f $COMPOSE_FILE exec backend python manage.py shell
    ;;
  *)
    # Default help message if an unknown command is passed
    echo "Usage: $0 {up|up-build|down|stop|ps|logs|bash|shell} [dev|prod]"
    exit 1
    ;;
esac
