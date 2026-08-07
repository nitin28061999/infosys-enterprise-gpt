"use client";

import { useState } from "react";
import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";
import PageHeader from "@/component/common/Pageheader";
import ChatWindow, { type DisplayMessage } from "@/component/chat/ChatWindow";
import ChatInput from "@/component/chat/Chatinput";
import CitationPanel from "@/component/chat/CitationPanel";
import SuggestedPrompt from "@/component/chat/SuggestedPrompt";
import { queryApi, ApiError, type Citation } from "@/lib/api";

export default function ChatPage() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(question: string) {
    setError(null);

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", message: question },
    ]);

    setLoading(true);
    try {
      const result = await queryApi.ask(question);
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", message: result.answer },
      ]);
      setCitations(result.citations ?? []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to get a response.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-8">
          <PageHeader
            title="Enterprise GPT"
            description="Ask questions across your enterprise knowledge base with AI-powered, citation-backed answers."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <ChatWindow messages={messages} loading={loading} error={error} />
              <ChatInput onSend={handleSend} disabled={loading} />
            </div>

            <div className="space-y-6">
              <SuggestedPrompt onSelect={handleSend} />
              <CitationPanel citations={citations} />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
