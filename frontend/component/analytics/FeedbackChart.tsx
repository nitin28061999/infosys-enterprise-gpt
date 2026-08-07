export default function FeedbackChart() {
  const positive = 92;
  const neutral = 6;
  const negative = 2;

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        AI Feedback
      </h2>

      <div className="space-y-5">
        <div>
          <div className="mb-2 flex justify-between">
            <span>Positive</span>

            <span>{positive}%</span>
          </div>

          <div className="h-3 rounded-full bg-slate-200">
            <div
              className="h-3 rounded-full bg-green-600"
              style={{ width: `${positive}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between">
            <span>Neutral</span>

            <span>{neutral}%</span>
          </div>

          <div className="h-3 rounded-full bg-slate-200">
            <div
              className="h-3 rounded-full bg-yellow-500"
              style={{ width: `${neutral}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between">
            <span>Negative</span>

            <span>{negative}%</span>
          </div>

          <div className="h-3 rounded-full bg-slate-200">
            <div
              className="h-3 rounded-full bg-red-600"
              style={{ width: `${negative}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}