# Verification Checklist — Largo Lions Class of 2026

Run this after bootstrap and at key milestones.

---

## Environment

- [ ] **Node.js** v18+ — `node -v`
- [ ] **npm** — `npm -v`
- [ ] **git** — `git --version`
- [ ] **Shell** — Windows: use Git Bash (not PowerShell)

---

## Bootstrap (Phase 0)

- [ ] Repo root contains `00-cursorrules.md`
- [ ] Repo root contains `BUILD_MANIFEST.md`
- [ ] Repo root contains `setup-cursorrules.sh`
- [ ] `.cursor/rules/` exists and contains `largo-lions-2026.mdc`
- [ ] `.gitignore` exists (Node/Next.js patterns)
- [ ] Git initialized — `git status` works
- [ ] Bootstrap commit present — `git log -1 --oneline` shows initial commit

---

## Verification commands (copy-paste)

```bash
node -v && npm -v && git --version
ls -la 00-cursorrules.md BUILD_MANIFEST.md setup-cursorrules.sh .gitignore
ls -la .cursor/rules/
git status
git log -1 --oneline
```

---

*Update this checklist when new phases add verification steps.*
