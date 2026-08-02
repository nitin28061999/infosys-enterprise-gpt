"use client";

import { useState } from "react";

export default function SecuritySettings() {

  const [currentPassword,setCurrentPassword]=useState("");
  const [newPassword,setNewPassword]=useState("");

  return (

    <div className="rounded-xl bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Security
      </h2>

      <div className="space-y-4">

        <input
          type="password"
          placeholder="Current Password"
          className="w-full rounded-lg border p-3"
          value={currentPassword}
          onChange={(e)=>setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full rounded-lg border p-3"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
        />

        <button className="rounded-lg bg-red-600 px-6 py-3 text-white">
          Change Password
        </button>

      </div>

    </div>

  );
}