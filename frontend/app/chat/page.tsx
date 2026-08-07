"use client";

import { useEffect, useState } from "react";
import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";
import PageHeader from "@/component/common/Pageheader";
import ChatWindow from "@/component/chat/ChatWindow";
import ChatInput from "@/component/chat/Chatinput";
import CitationPanel from "@/component/chat/CitationPanel";
import SuggestedPrompt from "@/component/chat/SuggestedPrompt";
import { chatApi, ApiError, type ChatMessage } from "@/lib/api";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    chatApi
      .getMessages()
      .then(setMessages)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load conversation.")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleSend(message: string) {
    const optimisticUser: ChatMessage = {
      id: `pending-${Date.now()}`,
      role: "user",
      message,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUser]);
    setError(null);

    try {
      const reply = await chatApi.send(message);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send message.");
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
              <CitationPanel
                citations={
                  messages.length > 0
                    ? messages[messages.length - 1].citations ?? []
                    : []
                }
              />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
