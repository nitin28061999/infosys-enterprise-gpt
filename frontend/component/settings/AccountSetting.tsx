"use client";

import { useState } from "react";

export default function AccountSettings() {

  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@enterprisegpt.com");

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Account Settings
      </h2>

      <div className="space-y-4">

        <input
          className="w-full rounded-lg border p-3"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          className="w-full rounded-lg border p-3"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <button className="rounded-lg bg-blue-600 px-6 py-3 text-white">
          Save Changes
        </button>

      </div>

    </div>
  );
}