#!/usr/bin/env bash
# keep-awake.sh — start caffeinate tied to calling script's PID and verify assertion
# Sourced by sprint launchers, migrate-apply-v6.sh, and deploy scripts.
# Iron Law (2026-11-14): every sprint run keeps the computer awake.
# Source this file, then call: keep_awake_start "$$"

keep_awake_start() {
  # No-op on non-macOS
  if [[ "$(uname)" != "Darwin" ]]; then
    echo "ℹ️  keep-awake: non-macOS ($(uname)) — no-op"
    return 0
  fi
  local caller_pid="${1:-$$}"
  caffeinate -dimsu -w "$caller_pid" &
  KEEP_AWAKE_PID=$!
  sleep 2  # allow assertion to register

  local assertions
  assertions=$(pmset -g assertions 2>/dev/null)
  if echo "$assertions" | grep -q "PreventUserIdleSystemSleep" && \
     echo "$assertions" | grep -q "PreventUserIdleDisplaySleep"; then
    echo "✅ keep-awake: caffeinate -dimsu held (PreventUserIdleSystemSleep + PreventUserIdleDisplaySleep) — PID $KEEP_AWAKE_PID"
    return 0
  else
    echo "❌ BLOCKED: keep-awake assertion NOT held after caffeinate start. pmset output:"
    echo "$assertions" | head -20
    return 1
  fi
}

keep_awake_stop() {
  if [[ -n "${KEEP_AWAKE_PID:-}" ]]; then
    kill "$KEEP_AWAKE_PID" 2>/dev/null || true
    echo "ℹ️  keep-awake: caffeinate stopped (PID $KEEP_AWAKE_PID)"
    KEEP_AWAKE_PID=""
  fi
}

# Auto-start if sourced with KEEP_AWAKE_AUTO=yes
if [[ "${KEEP_AWAKE_AUTO:-}" == "yes" ]]; then
  keep_awake_start "$$" || exit 1
fi
