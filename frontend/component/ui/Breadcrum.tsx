import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-blue-600 hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-gray-800">
              {item.label}
            </span>
          )}

          {index < items.length - 1 && (
            <span className="mx-2 text-gray-400">/</span>
          )}
        </div>
      ))}
    </nav>
  );
}