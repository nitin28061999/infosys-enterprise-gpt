import type { ActivityItem } from "@/lib/api";

interface ActivityCardProps {
  activities: ActivityItem[];
}

export default function ActivityCard({ activities }: ActivityCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">Recent Activity</h2>

      {activities.length === 0 ? (
        <p className="text-sm text-slate-400">No recent activity.</p>
      ) : (
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
      )}
    </div>
  );
}
