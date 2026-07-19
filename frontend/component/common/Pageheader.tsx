import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function PageHeader({
  title,
  description,
  buttonText,
  buttonLink,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>

        {description && (
          <p className="mt-2 text-sm text-slate-600">
            {description}
          </p>
        )}
      </div>

      {buttonText && buttonLink && (
        <Link
          href={buttonLink}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}