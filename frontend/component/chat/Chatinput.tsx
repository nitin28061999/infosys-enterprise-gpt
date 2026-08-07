"use client";

import { useState } from "react";
import Button from "@/component/ui/Button";
import Input from "@/component/ui/Input";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      await onSend(trimmed);
      setValue("");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        placeholder="Ask about HR policy, SOPs, engineering docs..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled || sending}
      />
      <Button type="submit" disabled={disabled || sending || !value.trim()}>
        {sending ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
