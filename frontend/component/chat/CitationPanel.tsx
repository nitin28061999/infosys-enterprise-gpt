import type { Citation } from "@/lib/api";

interface CitationPanelProps {
  citations: Citation[];
}

export default function CitationPanel({ citations }: CitationPanelProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">Sources</h2>

      {citations.length === 0 ? (
        <p className="text-sm text-slate-400">
          Sources for the latest answer will appear here.
        </p>
      ) : (
        <div className="space-y-4">
          {citations.map((item, i) => (
            <div
              key={`${item.document_id ?? i}-${item.page_number ?? i}`}
              className="rounded-lg border p-4 hover:bg-slate-50"
            >
              <h3 className="font-semibold">
                {item.document_name ?? "Untitled document"}
              </h3>
              {item.page_number !== undefined && (
                <p className="text-sm text-slate-500">
                  Page {item.page_number}
                </p>
              )}
              {item.text && (
                <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                  {item.text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
