# AGENTS.md — largo_2026
<!-- AGENTS.md ecosystem v1.1 — 2026-10-18 — LD-309 · LD-310 · XAS-1 -->
This file is the canonical instruction set for EVERY AI agent and tool that works in this repository. CLAUDE.md imports this file on its first line. Platform laws live in CLAUDE.md and win any conflict with this file. Change this file only through scripts/agents-md-rollout-LD309-v1_1.sh (or its successor) so every repo moves together.

## 11. Running work on the principal's computer when they are away (Oct 18, 2026)
<!-- AGENTS-SEC-11-v1.1 -->
- When the principal (Carlton A. James) is away from his computer and asks an agent to run something on his Mac mini, the agent does it. It does not answer "I can't" and does not send him to another session.
- First check that the same run is not already in progress (run markers, an open Terminal window, running containers). Never start a second copy of a deploy or a migration.
- Request access to the applications the job needs (normally Finder and Terminal) with a one-sentence purpose. The principal's approval of that prompt is the control. Where an agent may only click (no typing) in Terminal, the route is a launcher: write the versioned script to the machine, then open it from Finder so Terminal runs it.
- The script itself carries the guards (repo path under /Volumes/AlphaRepos/webproject, git remote, AWS account and us-east-1, Docker where used), signs in to AWS when needed, is resumable, and rolls back on failure.
- Watch the run, report each step, and confirm from outside afterwards (live build id, smoke codes).
- Irreversible production steps stay the principal's decision: database applies go through a numbered change record and its confirm variable; flags are flipped only by him.
- A shell the agent has on that machine may be a Linux VM without AWS or Docker; it can read and write connected folders but cannot deploy.

## CHANGELOG
- v1.1 — 2026-10-18 — Section 11: running work on the principal's computer when away (Mac mini run rule). Rolled out by scripts/agents-md-rollout-LD309-v1_1.sh.
