import ProfileCard from "./ProfileCard";
import AccountSettings from "./AccountSetting";
import NotificationSettings from "./NotificationSettings";
import ThemeSettings from "./ThemeSettings";
import SecuritySettings from "./SecuritySettings";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-8 text-4xl font-bold text-slate-800">
          Settings
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">

          <div className="space-y-6">
            <ProfileCard />
            <ThemeSettings />
          </div>

          <div className="space-y-6 lg:col-span-2">
            <AccountSettings />
            <NotificationSettings />
            <SecuritySettings />
          </div>

        </div>

      </div>
    </main>
  );
}