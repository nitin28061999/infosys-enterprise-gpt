"use client";

import { useState } from "react";

interface Tab {
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>

      <div className="mb-6 flex flex-wrap gap-2 border-b pb-2">

        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`rounded-lg px-5 py-2 transition ${
              activeTab === index
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {tab.title}
          </button>
        ))}

      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        {tabs[activeTab].content}
      </div>

    </div>
  );
}