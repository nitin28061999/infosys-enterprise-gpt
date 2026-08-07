"use client";

import { useState } from "react";

export default function ChatInput() {
  const [question, setQuestion] = useState("");

  const sendMessage = () => {
    if (!question.trim()) return;

    alert(`Question: ${question}`);
    setQuestion("");
  };

  return (
    <div className="flex gap-3 rounded-xl border bg-white p-4 shadow-sm">
      <input
        className="flex-1 rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ask anything about your enterprise knowledge..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={sendMessage}
        className="rounded-lg bg-blue-600 px-6 text-white hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
}