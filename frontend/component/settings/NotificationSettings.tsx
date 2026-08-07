// No notification-preferences endpoint exists on the backend yet.
export default function NotificationSettings() {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Notification Settings</h2>
      <p className="text-sm text-slate-500">
        Notification preferences aren&apos;t supported yet — this needs a
        backend endpoint that hasn&apos;t been built.
      </p>
    </div>
  );
}
