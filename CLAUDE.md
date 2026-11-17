# CLAUDE.md

@AGENTS.md

## IRON LAW — EVERY SPRINT KEEPS THE COMPUTER AWAKE (Carlton A. James, Nov 14, 2026)

- Every sprint, overnight run and headless Claude Code session holds `caffeinate -dimsu` for its entire duration. No exceptions.
- The launcher, the run script and each `claude` invocation all hold the lock (`caffeinate -dimsu -w $$` in run.sh, and `caffeinate -dimsu claude -p ...` per phase).
- Before the first action, verify with `pmset -g assertions`: PreventUserIdleSystemSleep and PreventUserIdleDisplaySleep must be held by caffeinate. Save the output to the sprint evidence folder at start and after each phase.
- If the assertion is not held, the run writes BLOCKED-keepawake and stops. A sleeping Mac is a sprint failure.
- Implemented in `scripts/lib/keep-awake.sh` (xray_platform: `infra/scripts/lib/keep-awake.sh`) and checked by `scripts/check-keep-awake.sh`.
- A locked screen is not prevented by caffeinate. Keep the Mac on power, and do not lock it during a run.

Handoff standard: 95/5 (AI 95%, Carlton 5%). The 5% is only what a human must do: typed confirmations, signatures, consent recordings, payments, legal.
