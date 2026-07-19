const prompts = [
  "Summarize the HR leave policy",
  "Explain engineering deployment process",
  "What are the onboarding steps?",
  "Show sales guidelines",
];

export default function SuggestedPrompt() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Suggested Prompts
      </h2>

      <div className="flex flex-wrap gap-3">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            className="rounded-full border px-4 py-2 hover:bg-blue-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}