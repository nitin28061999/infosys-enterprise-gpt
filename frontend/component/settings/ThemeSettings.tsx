// No theme-preference endpoint exists on the backend yet.
export default function ThemeSettings() {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Theme</h2>
      <p className="text-sm text-slate-500">
        Theme preferences aren&apos;t supported yet — this needs a backend
        endpoint that hasn&apos;t been built.
      </p>
    </div>
  );
}
