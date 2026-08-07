"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

export interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  message: string;
}

interface ChatWindowProps {
  messages: DisplayMessage[];
  loading: boolean;
  error: string | null;
}

export default function ChatWindow({ messages, loading, error }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="rounded-xl border bg-slate-50 p-6 shadow-sm h-[600px] overflow-y-auto">
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {messages.length === 0 && !loading && (
        <p className="text-sm text-slate-400">
          No messages yet. Ask a question to get started. (Conversation
          history isn&apos;t persisted by the backend yet — this resets on
          page refresh.)
        </p>
      )}

      {messages.map((m) => (
        <ChatMessage key={m.id} role={m.role} message={m.message} />
      ))}

      {loading && (
        <p className="text-sm text-slate-400">Thinking...</p>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
