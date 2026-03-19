#!/usr/bin/env bash
# setup-cursorrules.sh — Install Largo Lions 2026 Cursor rules from 00-cursorrules.md
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
RULES_DIR=".cursor/rules"
SOURCE_FILE="00-cursorrules.md"
RULE_FILE="${RULES_DIR}/largo-lions-2026.mdc"

mkdir -p "$RULES_DIR"

{
  echo '---'
  echo 'description: Largo Lions Class of 2026 — build protocol, code standards, brand, SEO'
  echo 'alwaysApply: true'
  echo '---'
  echo ''
  cat "$SOURCE_FILE"
} > "$RULE_FILE"

echo "Created $RULE_FILE from $SOURCE_FILE"
ls -la "$RULES_DIR"
