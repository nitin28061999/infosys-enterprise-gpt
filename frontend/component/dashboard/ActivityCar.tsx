const activities = [
  {
    id: 1,
    title: "HR Policy uploaded",
    time: "10 mins ago",
  },
  {
    id: 2,
    title: "Engineering Guide updated",
    time: "1 hour ago",
  },
  {
    id: 3,
    title: "AI answered 145 questions",
    time: "Today",
  },
];

export default function ActivityCard() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
          >
            <p className="font-medium">{activity.title}</p>
            <p className="text-sm text-slate-500">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}