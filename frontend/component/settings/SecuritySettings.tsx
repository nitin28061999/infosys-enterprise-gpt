// No password-change endpoint exists on the backend yet.
export default function SecuritySettings() {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Security</h2>
      <p className="text-sm text-slate-500">
        Password changes aren&apos;t available yet — the backend doesn&apos;t
        expose an endpoint for this. Contact your administrator if you need
        your password reset.
      </p>
    </div>
  );
}
