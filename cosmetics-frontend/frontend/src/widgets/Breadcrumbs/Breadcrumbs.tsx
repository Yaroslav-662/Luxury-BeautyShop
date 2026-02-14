import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="text-gray-400 text-sm flex gap-2 mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}

          {item.to ? (
            <Link to={item.to} className="hover:text-yellow-500">
              {item.label}
            </Link>
          ) : (
            <span className="text-yellow-500">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
