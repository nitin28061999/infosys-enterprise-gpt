export default function CitationPanel() {
  const citations = [
    {
      title: "HR Leave Policy.pdf",
      page: 12,
    },
    {
      title: "Employee Handbook.pdf",
      page: 8,
    },
  ];

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Sources
      </h2>

      <div className="space-y-4">
        {citations.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border p-4 hover:bg-slate-50"
          >
            <h3 className="font-semibold">
              {item.title}
            </h3>

            <p className="text-sm text-slate-500">
              Page {item.page}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}