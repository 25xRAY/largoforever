#!/usr/bin/env bash
# check-keep-awake.sh — A-18 keep-awake check (Iron Law, Carlton A. James, Nov 14, 2026).
# Static mode (default): repo carries the iron-law section in AGENTS.md and CLAUDE.md plus the keep-awake lib.
# Runtime mode (--runtime): also confirms the sleep assertions are held right now (macOS only).
set -u
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HDR="IRON LAW — EVERY SPRINT KEEPS THE COMPUTER AWAKE"
FAIL=0
for f in AGENTS.md CLAUDE.md; do
  if [[ -f "$ROOT/$f" ]] && grep -q "$HDR" "$ROOT/$f"; then echo "OK   $f carries the iron-law section"
  else echo "FAIL $f missing the iron-law section"; FAIL=1; fi
done
if [[ -f "$ROOT/scripts/lib/keep-awake.sh" || -f "$ROOT/infra/scripts/lib/keep-awake.sh" ]]; then echo "OK   keep-awake lib present"
else echo "FAIL keep-awake lib missing"; FAIL=1; fi
if [[ "${1:-}" == "--runtime" && "$(uname)" == "Darwin" ]]; then
  A="$(pmset -g assertions 2>/dev/null)"
  if echo "$A" | grep -q PreventUserIdleSystemSleep && echo "$A" | grep -q PreventUserIdleDisplaySleep; then echo "OK   sleep assertions held"
  else echo "FAIL sleep assertions NOT held (BLOCKED-keepawake)"; FAIL=1; fi
fi
exit $FAIL
