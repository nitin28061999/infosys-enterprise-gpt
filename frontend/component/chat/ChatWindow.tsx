"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import type { ChatMessage as ChatMessageType } from "@/lib/api";

interface ChatWindowProps {
  messages: ChatMessageType[];
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
      {loading && messages.length === 0 && (
        <p className="text-sm text-slate-400">Loading conversation...</p>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && messages.length === 0 && (
        <p className="text-sm text-slate-400">
          No messages yet. Ask a question to get started.
        </p>
      )}

      {messages.map((m) => (
        <ChatMessage key={m.id} role={m.role} message={m.message} />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
