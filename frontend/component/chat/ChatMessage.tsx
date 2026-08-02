interface ChatMessageProps {
  role: "user" | "assistant";
  message: string;
}

export default function ChatMessage({
  role,
  message,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-3xl rounded-xl px-5 py-4 shadow-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white border border-slate-200"
        }`}
      >
        <p>{message}</p>
      </div>
    </div>
  );
}