/**
 * Self-contained HTML fragments for archival exports (inline navy/gold styles, no external JS).
 */

const INLINE_STYLE = `
  body{font-family:system-ui,sans-serif;margin:0;padding:1.5rem;background:#E6EEF5;color:#000F2B;}
  .card{background:#fff;border:2px solid #003B7A;border-radius:12px;padding:1.25rem;margin-bottom:1rem;box-shadow:0 4px 12px rgba(0,59,122,0.08);}
  h1{color:#003B7A;font-size:1.75rem;}
  .gold{color:#FFD700;}
`;

export function renderIndexPageToHTML(): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Largo Lions Class of 2026</title><style>${INLINE_STYLE}</style></head><body><div class="card"><h1>Largo Lions <span class="gold">Class of 2026</span></h1><p>Legacy in Motion… Altitude Achieved.</p></div></body></html>`;
}

export function renderWallOfWinsToHTML(institutions: string[]): string {
  const items = institutions.map((n) => `<li class="card">${escapeHtml(n)}</li>`).join("");
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Wall of Wins</title><style>${INLINE_STYLE}</style></head><body><h1>Wall of Wins</h1><ul style="list-style:none;padding:0">${items}</ul></body></html>`;
}

export function renderYearbookPageToHTML(displayName: string, tagline: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>${escapeHtml(displayName)}</title><style>${INLINE_STYLE}</style></head><body><div class="card"><h1>${escapeHtml(displayName)}</h1><p>${escapeHtml(tagline)}</p></div></body></html>`;
}

export function renderResourcesPageToHTML(): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Resources</title><style>${INLINE_STYLE}</style></head><body><div class="card"><h1>Student Resources</h1><p>Graduation requirements, counseling, and links (static export).</p></div></body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
