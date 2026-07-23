"use client";

import { useState } from "react";

export default function ThemeSettings() {

  const [theme, setTheme] = useState("Light");

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Theme
      </h2>

      <select
        className="w-full rounded-lg border p-3"
        value={theme}
        onChange={(e)=>setTheme(e.target.value)}
      >

        <option>Light</option>

        <option>Dark</option>

        <option>System</option>

      </select>

    </div>
  );
}