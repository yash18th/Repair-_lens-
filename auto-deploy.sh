#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[auto-deploy] ERROR: This directory is not a git repository." >&2
  exit 1
fi

node ./scripts/auto-deploy.js
exit "$?"
