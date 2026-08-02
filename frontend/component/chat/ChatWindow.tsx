import ChatMessage from "./ChatMessage";

export default function ChatWindow() {
  return (
    <div className="rounded-xl border bg-slate-50 p-6 shadow-sm h-[600px] overflow-y-auto">
      <ChatMessage
        role="assistant"
        message="Hello! I am your Enterprise AI Assistant. How can I help you today?"
      />

      <ChatMessage
        role="user"
        message="Explain the company's leave policy."
      />

      <ChatMessage
        role="assistant"
        message="According to the HR Leave Policy, employees receive 24 annual leave days and 12 sick leave days."
      />
    </div>
  );
}