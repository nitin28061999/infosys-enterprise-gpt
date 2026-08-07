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
          {citations.map((item) => (
            <div
              key={`${item.title}-${item.page}`}
              className="rounded-lg border p-4 hover:bg-slate-50"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-slate-500">Page {item.page}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
