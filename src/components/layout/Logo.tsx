/** Inline SVG lion shield logo, navy/gold, with '26'. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M24 2L44 14v20L24 54L4 34V14L24 2z"
        fill="#003B7A"
        stroke="#FFD700"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fill="#FFD700"
        fontFamily="var(--font-montserrat), Montserrat, sans-serif"
        fontWeight="700"
        fontSize="14"
      >
        26
      </text>
    </svg>
  );
}
