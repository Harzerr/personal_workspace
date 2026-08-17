#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${IMAGE_NAME:-personal-workspace-app}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

docker build --load -t "${IMAGE_NAME}:${IMAGE_TAG}" -f ./Dockerfile .
