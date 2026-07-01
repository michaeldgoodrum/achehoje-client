#!/usr/bin/env bash
# Installs Docker + Compose and starts the production stack on Amazon Linux
# 2023. Run from the repository root:
#
#   sudo bash deploy/bootstrap.sh
#
# (For the CloudFormation path this runs automatically via the instance's
# user-data — see deploy/cloudformation.yaml and deploy/DEPLOY.md.)
set -euxo pipefail

# Docker Engine (Amazon Linux 2023 ships it in the default repos).
if ! command -v docker >/dev/null 2>&1; then
  dnf install -y docker
  systemctl enable --now docker
fi

# Docker Compose v2 plugin (arch-matched: x86_64 or aarch64).
if ! docker compose version >/dev/null 2>&1; then
  mkdir -p /usr/local/lib/docker/cli-plugins
  curl -fsSL \
    "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" \
    -o /usr/local/lib/docker/cli-plugins/docker-compose
  chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
fi

# Buildx plugin — required to build images ("compose build requires buildx").
# Amazon Linux 2023's docker package doesn't ship it. Note: buildx assets use
# arm64/amd64 naming (not aarch64/x86_64) and carry the version in the filename,
# so we can't reuse the compose download trick.
if ! docker buildx version >/dev/null 2>&1; then
  case "$(uname -m)" in
    aarch64) BUILDX_ARCH=arm64 ;;
    x86_64)  BUILDX_ARCH=amd64 ;;
    *) echo "unsupported arch for buildx: $(uname -m)" >&2; exit 1 ;;
  esac
  BUILDX_VERSION=v0.19.3
  mkdir -p /usr/local/lib/docker/cli-plugins
  curl -fsSL \
    "https://github.com/docker/buildx/releases/download/${BUILDX_VERSION}/buildx-${BUILDX_VERSION}.linux-${BUILDX_ARCH}" \
    -o /usr/local/lib/docker/cli-plugins/docker-buildx
  chmod +x /usr/local/lib/docker/cli-plugins/docker-buildx
fi

# Build and start the stack. Runs from the repo root regardless of where the
# script was invoked from.
cd "$(dirname "$0")/.."
docker compose -f deploy/docker-compose.prod.yml up -d --build

echo "✅ Stack is up. Frontend + API are served on port 80."
