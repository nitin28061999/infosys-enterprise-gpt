interface Activity {
  title: string;
  time: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export default function ActivityTimeline({
  activities,
}: ActivityTimelineProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-xl font-semibold">
        Recent Activity
      </h2>

      <div className="space-y-5">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-4">
            <div className="mt-2 h-3 w-3 rounded-full bg-blue-600" />

            <div>
              <p className="font-medium">
                {activity.title}
              </p>

              <p className="text-sm text-gray-500">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}