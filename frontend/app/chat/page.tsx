"use client";

import { useState } from "react";
import Link from "next/link";
import { queryApi, ApiError, type Citation } from "@/lib/api";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  message: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setError(null);
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", message: trimmed }]);
    setQuestion("");
    setLoading(true);

    try {
      const result = await queryApi.ask(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", message: result.answer },
      ]);
      setCitations(result.citations ?? []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to get a response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Enterprise GPT</h1>
            <p className="mt-1 text-slate-600">
              Ask questions across your enterprise knowledge base.
            </p>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-blue-700 hover:underline">
            Dashboard
          </Link>
        </div>

        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <div className="h-[430px] space-y-4 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="rounded-xl bg-slate-100 p-4 text-slate-600">
                Ask a question to get started.
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-3xl rounded-xl p-4 ${
                    m.role === "user" ? "ml-auto bg-blue-600 text-white" : "bg-slate-100 text-slate-900"
                  }`}
                >
                  {m.message}
                </div>
              ))
            )}
            {loading && <p className="text-sm text-slate-400">Thinking...</p>}
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          </div>

          <form onSubmit={submit} className="mt-5 flex gap-3 border-t pt-5">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border p-3"
              placeholder="Ask about your enterprise knowledge..."
              disabled={loading}
            />
            <button
              className="rounded-lg bg-blue-600 px-5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              disabled={loading || !question.trim()}
            >
              Send
            </button>
          </form>
        </div>

        {citations.length > 0 && (
          <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Sources</h2>
            <ul className="space-y-2 text-sm">
              {citations.map((c, i) => (
                <li key={`${c.document_id ?? i}`} className="rounded-lg bg-slate-50 p-3">
                  <span className="font-medium">{c.document_name ?? "Untitled document"}</span>
                  {c.page_number !== undefined && (
                    <span className="text-slate-500"> — page {c.page_number}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
