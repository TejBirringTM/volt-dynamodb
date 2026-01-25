#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/_linux-vm.sh"

# Path to Docker CLI's plugins directory
DOCKER_PLUGINS_DIR="${DOCKER_CONFIG}/cli-plugins"

# Paths to Docker CLI plugins
DOCKER_COMPOSE_PLUGIN_PATH="$(mise where aqua:docker/compose)/docker-cli-plugin-docker-compose"
DOCKER_BUILDX_PLUGIN_PATH="$(mise where aqua:docker/buildx)/docker-cli-plugin-docker-buildx"

# Check if Docker CLI and plugins are installed by Mise
if ! command -v docker &> /dev/null; then
  echo "❌ Docker CLI is not available."
  exit 1
fi
if [[ ! -f "${DOCKER_COMPOSE_PLUGIN_PATH}" ]]; then
  echo "❌ Docker Compose plugin is not available."
  exit 1
fi
if [[ ! -f "${DOCKER_BUILDX_PLUGIN_PATH}" ]]; then
  echo "❌ Docker Buildx plugin is not available."
  exit 1
fi

# Install Docker Compose plugin
mkdir -p "${DOCKER_PLUGINS_DIR}" \
  && cp -f "${DOCKER_COMPOSE_PLUGIN_PATH}" "${DOCKER_PLUGINS_DIR}/docker-compose" \
  && chmod +x "${DOCKER_PLUGINS_DIR}/docker-compose"

if docker compose &> /dev/null; then
  echo "✅ Docker Compose plugin installed!"
else
  echo "❌ Failed to install Docker Compose plugin."
  exit 1
fi

# Install Docker Buildx plugin (required by Docker Compose plugin)
mkdir -p "${DOCKER_PLUGINS_DIR}" \
  && cp -f "${DOCKER_BUILDX_PLUGIN_PATH}" "${DOCKER_PLUGINS_DIR}/docker-buildx" \
  && chmod +x "${DOCKER_PLUGINS_DIR}/docker-buildx"

if docker buildx &> /dev/null; then
  echo "✅ Docker Buildx plugin installed!"
else
  echo "❌ Failed to install Docker Buildx plugin."
  exit 1
fi

if [[ "$(is_vm_required)" = "true" ]]; then
  echo "ℹ️ Linux VM is required on this machine."
  # Ensure Colima is installed
  if ! command -v colima &> /dev/null; then
    echo "❌ Colima is not available."
    exit 1
  fi
  # Ensure Colima is running
  if ! colima status &> /dev/null; then
    echo "🚀 Starting Linux VM..."
    start_linux_vm
  else
    echo "✅ Linux VM already running!"
  fi
fi

# Check Docker CLI is connected to the Docker Daemon API
if docker ps &> /dev/null; then
  echo "✅ Docker configured successfully!"
else
  echo "❌ Failed to configure Docker."
fi
