"use client";

import { useState } from "react";

export default function NotificationSettings() {

  const [email, setEmail] = useState(true);
  const [system, setSystem] = useState(true);
  const [updates, setUpdates] = useState(false);

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Notification Settings
      </h2>

      <div className="space-y-4">

        <label className="flex items-center justify-between">

          Email Notifications

          <input
            type="checkbox"
            checked={email}
            onChange={()=>setEmail(!email)}
          />

        </label>

        <label className="flex items-center justify-between">

          System Alerts

          <input
            type="checkbox"
            checked={system}
            onChange={()=>setSystem(!system)}
          />

        </label>

        <label className="flex items-center justify-between">

          Product Updates

          <input
            type="checkbox"
            checked={updates}
            onChange={()=>setUpdates(!updates)}
          />

        </label>

      </div>

    </div>
  );
}