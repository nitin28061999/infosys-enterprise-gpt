import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";

import PageHeader from "@/component/common/Pageheader";

import ChatWindow from "@/component/chat/ChatWindow";
import ChatInput from "@/component/chat/Chatinput";
import CitationPanel from "@/component/chat/CitationPanel";
import SuggestedPrompt from "@/component/chat/SuggestedPrompt";

export default function ChatPage() {
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
              <ChatWindow />
              <ChatInput />
            </div>

            <div className="space-y-6">
              <SuggestedPrompt />
              <CitationPanel />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}