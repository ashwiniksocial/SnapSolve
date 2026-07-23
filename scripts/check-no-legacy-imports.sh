#!/usr/bin/env bash
# check-no-legacy-imports.sh
# Fails if any active source file imports from /legacy/.
# Run before build or in CI: bash scripts/check-no-legacy-imports.sh

set -euo pipefail

MATCHES=$(grep -r --include="*.ts" --include="*.tsx" "from ['\"].*legacy" \
  artifacts/ lib/ 2>/dev/null || true)

if [ -n "$MATCHES" ]; then
  echo "ERROR: active source files import from /legacy/:"
  echo "$MATCHES"
  exit 1
fi

echo "OK: zero active imports from /legacy."
