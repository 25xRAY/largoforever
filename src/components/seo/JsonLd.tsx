interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders a script tag with JSON-LD structured data. Properly escapes for XSS.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
