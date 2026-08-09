# THE PATENT FILING STANDARD — v1.0
## 25 ACTUAL Holdings LLC · Pro Se Provisional Filing SOP
**Authority:** THE CARLTON STANDARD §13 (Patent Standard) · **Effective:** 2026-08-09
**Status:** LOCKED — verified live across 5 filings on 2026-08-09 (dockets 009, 010, 011, 012, 014)
**Inventor:** Carlton A. James (sole, pro se) · **IP owner:** 25 ACTUAL Holdings LLC (Wyoming) — INTERNAL ONLY

> This standard exists so every provisional is filed identically, correctly, and fast. It is not advice — it is the documented, proven procedure. Deviations require a stated reason. Confirm any legal specifics with counsel at attorney engagement (2027-02-25).

---

## §1 · WHAT GETS PATENTED — THE DECISION GATE

Before drafting, answer three questions:

1. **Is the mechanism novel?** Not the product — the *mechanism*. "We built X" is not patentable; "a system that does X by method M" may be. If a competitor's patent lawyer could read the claim as a step-by-step of a non-obvious method, it is a candidate.
2. **Is it about to be publicly disclosed?** Publishing a mechanism's *how* on a website, whitepaper, or demo is a **public disclosure**. US gives a 12-month grace period; **the EU/PCT and most of the world apply absolute novelty** — pre-filing disclosure permanently bars foreign rights. **If the mechanism is going public, FILE FIRST.**
3. **Category vs. mechanism.** Describing a *capability at the category level* ("the platform is classification-native") is safe to publish if it reads on already-filed generic claims. Describing the *engine internals* ("it normalizes through an ISIC pivot to a canonical profile") is a mechanism disclosure — that needs its own filing first. **Publish category; file mechanism.**

---

## §2 · DRAFTING RULES — SCOPE PROTECTION (non-negotiable)

- **Title and claims are industry-agnostic.** "Veteran," "VOSB," or any audience appears ONLY as a non-limiting example in the specification (an [0027]-style paragraph), NEVER in the title or any claim. Audience words in claims narrow protection.
- **Never name a brand in title or claims.** No "X.R.A.Y.", no product name. Brand words narrow protection and date the filing.
- **Never put internal codenames in claims or title.** No XCIP, GENESIS, KÁRMÁN, VAULT, etc. Use the generic function ("a canonical entity profile," "an orchestration kernel").
- **Never name a trademarked classification scheme.** GICS® and ICB® are excluded entirely — not loaded, not named, not branded near (A-14 abort).
- **Name real vendors only as production embodiments.** "a managed inference service (Amazon Bedrock in the production embodiment)" — the claim covers the generic, the example grounds it.
- **Current-state facts only.** us-east-1 (NEVER us-east-2), account 372482646107, ECS Fargate, "in continuous production as of [today's date]." Retired vendors (WorkOS/ID.me/Paddle/Neon/Supabase/Upstash) never appear.

---

## §3 · DOCUMENT STRUCTURE — THE PROVEN SHAPE

Every provisional is **one 16-page US-Letter PDF (612×792 pts)**:

| Part | Pages | Content |
|---|---|---|
| Specification | 8 | Cover table · Technical Field · Background (A–D problems) · Summary · Brief Description of Drawings · Detailed Description (~10 numbered sections) · **27 Claims** · Abstract |
| Drawings | 8 | FIG. 1–8, one per sheet, B&W line art, numbered reference numerals (100s–800s series), "FIG. N" bottom-right + docket bottom-left |

**Claims (27):**
- 3 independent: (1) system, (2) method, (3) non-transitory computer-readable medium
- ~22 dependent claims narrowing the independents
- A standard infra pair at the end (e.g. claim 26: model-adapter enforcement of managed inference; claim 27: feature-flag model router with sub-minute rollback)

**Cover table fields:** Inventor (first named) · Inventor Residence · Correspondence · Attorney Docket No. · Internal Reference · Entity Status ("Micro Entity — 37 C.F.R. § 1.29(a) — Certification PTO/SB/15A filed herewith") · Assignment · Drawing Sheets (8).

---

## §4 · THE SB/15A — MICRO ENTITY CERTIFICATION

- Use the **official fillable PTO/SB/15A** (Doc Code MES.GIB) — never recreate from scratch.
- Fill 6 fields: First Named Inventor · Title of Invention (**char-for-char** identical to spec title) · Signature `/Carlton A. James/` · Name · Date · Telephone 567-252-5742.
- **Item (1) "SMALL ENTITY REQUIREMENT" is required and correct.** Micro entity is a *sub-category* of small entity: you must certify the small-entity base (item 1) plus the micro conditions (items 2–4 = 4-application limit + income limit). Do not remove item (1) — it is the foundation of the micro claim, and it is what produced the $65 (not $130) fee on every prior filing.
- **Micro qualification:** income + 25 ACTUAL + 25 Alpha each under the annual gross-income limit; provisionals do not count toward the 4-application limit.

---

## §5 · FILING PROCEDURE — USPTO PATENT CENTER (verified live 5×)

1. **New Submission** → Utility → **Provisional** → **Web ADS**.
2. **Application Information:** paste title char-for-char · Docket `25ACTUAL-0##-PROV` · **Entity Status = Small** (Micro is NOT in the ADS dropdown — you claim it at the fee step) · Drawing Sheets = **8** · Filing-by-reference UNCHECKED.
3. **Inventor:** Carlton A. James · 2311 Woodley Road, Montgomery AL 36111-1629 · US citizen.
4. **Correspondence:** Carlton A. James / 25 ACTUAL Holdings LLC / 1309 Coffeen Avenue STE 1200 / Sheridan WY 82801 / info@25alpha.ai / 567-252-5742.
5. **Applicant screen: # applicants = 0, LEAVE EMPTY.** (Naming 25 ACTUAL as applicant triggers the 37 CFR 1.31/1.33 juristic-entity rule requiring a registered-practitioner signature. Inventor is applicant by default when the field is empty.)
6. **Sign Web ADS:** `/Carlton A. James/` (forward slashes both sides).
7. **Upload:** SPEC.pdf → *Application Part → Specification* · SB15A.pdf → *Entity Status Correspondence → Certification of Micro Entity Status (Gross Income Basis)*. The ADS auto-generates as the 3rd document. Number of pages = **16**.
8. **Calculate Fees:** select **Micro Entity → $65.00** (fee code 3005).
9. **Review & Submit** → pay **$65** the same sitting (card) → download **Acknowledgement Receipt** + **Payment Receipt**.
10. **Same session:** append the row to `PAT-INDEX.md` (+ `.json`), record first-public-exposure date if applicable, S3-sync to `alpha-patent-vault-372482646107`.

---

## §6 · BUILD PIPELINE (how the documents are produced)

1. Pull the mechanism from the source spec / GAP terminal docs — claims must be grounded in what was actually built, never invented.
2. `docx-js` → Times New Roman spec (Letter 612×792, 1440 twip margins) → `soffice.py` PDF.
3. `matplotlib` → 8 B&W line-art figures (figsize 8.5×11), reference numerals, FIG label + docket.
4. `pypdf` merge → one 16-page PDF, assert every page is 612×792.
5. Fill official SB/15A via `fill_fillable_fields.py` (JSON array of field values).
6. **Forensic audit before delivery:** title exact across spec + SB/15A · 27 claims sequential · dependent claims reference earlier claims only · industry-agnostic (no veteran/brand in title/claims) · no codenames · no GICS/ICB · no retired vendors · us-east-1 not us-east-2 · real current-state facts. Two-pass: any pdftotext flag is re-checked against the docx ground truth (line-wrap false positives are common).
7. Visual QA: render cover + a key figure + the SB/15A, eyeball them.
8. `present_files`, then tell Carlton to confirm the download landed before he files.

---

## §7 · ASSIGNMENT (deferred, non-urgent, $0)

Assignor Carlton A. James → Assignee 25 ACTUAL Holdings LLC. Batch all dockets at **assignmentcenter.uspto.gov** (ONE word — `assignment.uspto.gov` is DEAD, EPAS retired 2024-02-05). Needs a 1-page assignment PDF per application. Recording is title protection only; priority is already locked by the provisional filing.

---

## §8 · DEADLINE DISCIPLINE

- Every provisional has a **12-month non-provisional deadline** — file the non-provisional (or a follow-on) before it or the priority date is lost.
- Any mechanism narrowed by audience or example → schedule a **broadening provisional** with its own hard deadline.
- The `PAT-INDEX.md` §7 calendar is the master. KÁRMÁN surfaces deadlines.

---

*Technology owned by 25 ACTUAL Holdings LLC. Licensed through 25 Alpha LLC.*
*This standard is INTERNAL. Read it before drafting or filing any provisional.*

