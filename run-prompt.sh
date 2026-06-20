#!/bin/bash
# run-prompt.sh — Universal Claude Code Build Runner
# 25 Alpha LLC — v1.0 — June 2026
# Usage: bash ~/Downloads/run-prompt.sh PROMPT.md [budget]
set -euo pipefail
PROMPT_FILE="${1:-}"
BUDGET="${2:-15}"
GREEN='\033[0;32m'; RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; exit 1; }

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║  25 Alpha LLC — Claude Code Build Runner v1.0       ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

[ -z "$PROMPT_FILE" ] && fail "Usage: bash run-prompt.sh PROMPT.md [budget]"
[ -f "$HOME/Downloads/$PROMPT_FILE" ] || fail "Not found: ~/Downloads/$PROMPT_FILE — download it first"
git rev-parse --git-dir > /dev/null 2>&1 || fail "Not in a git repo — cd into your repo first"
command -v claude > /dev/null 2>&1 || fail "Claude Code not installed: npm install -g @anthropic-ai/claude-code"

REPO=$(basename "$(git rev-parse --show-toplevel)")
BRANCH=$(git branch --show-current)
ok "Repo: $REPO | Branch: $BRANCH | Budget: \$$BUDGET"

# LD-259 — kills build if anything is in us-east-2
for bucket in $(AWS_PAGER="" aws s3 ls --region us-east-1 2>/dev/null | awk '{print $3}'); do
  R=$(AWS_PAGER="" aws s3api get-bucket-location --bucket "$bucket" \
    --region us-east-1 --query LocationConstraint --output text 2>/dev/null || echo "")
  [ "$R" = "us-east-2" ] && fail "LD-259 VIOLATION: s3://$bucket is in us-east-2 — CANCELLED REGION. Fix first."
done
ok "LD-259 compliant — no us-east-2 resources"

# Move + commit prompt before build
mkdir -p prompts/active prompts/completed
cp "$HOME/Downloads/$PROMPT_FILE" "prompts/active/$PROMPT_FILE"
git add "prompts/active/$PROMPT_FILE"
git commit -m "build(prompt): activate $PROMPT_FILE — $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null || true
git push origin "$BRANCH" 2>/dev/null || true
ok "Prompt committed to GitHub before build starts"

echo ""
echo -e "${BOLD}── EXECUTING: $PROMPT_FILE — \$$BUDGET ─────────────────────${NC}"
echo ""

BUILD_EXIT=0
cat "prompts/active/$PROMPT_FILE" | \
  claude --print --dangerously-skip-permissions --max-budget-usd "$BUDGET" || BUILD_EXIT=$?

echo ""
if [ "$BUILD_EXIT" -ne "0" ]; then
  echo -e "${RED}❌ BUILD FAILED — prompt stays in prompts/active/ for retry${NC}"
  exit "$BUILD_EXIT"
fi

# Archive + commit on success
DONE="prompts/completed/${PROMPT_FILE%.md}-DONE-$(date '+%Y%m%d-%H%M%S').md"
mv "prompts/active/$PROMPT_FILE" "$DONE"
git add -A
git commit -m "build(complete): $PROMPT_FILE — $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null || true
git push origin "$BRANCH" 2>/dev/null || true

echo ""
echo -e "${GREEN}${BOLD}✅ BUILD COMPLETE — $REPO — See Through Everything.™${NC}"
echo ""
