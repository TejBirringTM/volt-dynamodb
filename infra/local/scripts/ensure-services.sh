#!/usr/bin/env bash
set -euo pipefail

# "$(dirname "$0")/ensure-docker.sh"

# Note: PROJECT_ROOT env var should be set by mise.toml,
#       this script will fail without it being set correctly

# Check if AWS CLI is installed by Mise
if ! command -v aws &> /dev/null; then
  echo "❌ AWS CLI is not available."
  exit 1
fi

# Check if LocalStack service is running
if [[ -n "$(docker ps -q -f name=volt-dynamodb-${GIT_COMMIT_SHA}-localstack-main)" ]]; then
  echo "✅ LocalStack already running!"
else
  echo "🚀 Starting LocalStack..."
  bash -c "cd ${PROJECT_ROOT}/infra/local && docker compose up --force-recreate --detach"
  sleep 10 # allow time for initialisation
  echo "✅ LocalStack is running!"
fi

# Check if LocalStack is configured correctly
if ! aws dynamodb list-tables &> /dev/null; then
  echo "❌ AWS CLI can not find LocalStack"
  exit 1
else
  echo "✅ LocalStack is working!"
fi
