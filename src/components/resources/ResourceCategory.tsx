import { ExternalLink } from "lucide-react";

export interface ResourceItem {
  id: string;
  title: string;
  url: string;
  description: string | null;
}

interface ResourceCategoryProps {
  title: string;
  resources: ResourceItem[];
}

/**
 * Card listing external resources with descriptions.
 */
export function ResourceCategory({ title, resources }: ResourceCategoryProps) {
  if (resources.length === 0) return null;
  return (
    <section
      className="rounded-card border border-navy-200 bg-white p-6 shadow-card"
      aria-labelledby={`cat-${title}`}
    >
      <h2 id={`cat-${title}`} className="font-heading text-xl font-bold text-navy-900">
        {title}
      </h2>
      <ul className="mt-4 space-y-4">
        {resources.map((r) => (
          <li key={r.id}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-start gap-2 font-medium text-navy-800 hover:text-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
            >
              <ExternalLink
                className="mt-0.5 h-4 w-4 shrink-0 text-navy-500 group-hover:text-gold-500"
                aria-hidden
              />
              <span>
                {r.title}
                {r.description && (
                  <span className="mt-1 block text-sm font-normal text-navy-600">
                    {r.description}
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
