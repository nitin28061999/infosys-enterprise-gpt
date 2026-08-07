"use client";

import { useCallback, useEffect, useState } from "react";

export type DocumentRecord = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
};

export type ChatRecord = { id: string; role: "user" | "assistant"; message: string };

export type EnterpriseData = {
  documents: DocumentRecord[];
  chats: ChatRecord[];
  user: { name: string; email: string } | null;
};

const key = "infosys-enterprise-gpt-data";
const defaults: EnterpriseData = { documents: [], chats: [], user: null };

function read(): EnterpriseData {
  if (typeof window === "undefined") return defaults;
  try {
    return { ...defaults, ...JSON.parse(window.localStorage.getItem(key) || "{}") };
  } catch {
    return defaults;
  }
}

function save(data: EnterpriseData) {
  window.localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new Event("enterprise-data-change"));
}

export function useEnterpriseData() {
  const [data, setData] = useState<EnterpriseData>(defaults);

  useEffect(() => {
    const sync = () => setData(read());
    sync();
    window.addEventListener("enterprise-data-change", sync);
    return () => window.removeEventListener("enterprise-data-change", sync);
  }, []);

  const update = useCallback((change: (current: EnterpriseData) => EnterpriseData) => {
    const next = change(read());
    save(next);
    setData(next);
  }, []);

  return {
    data,
    addDocument: (file: File) => update((current) => ({
      ...current,
      documents: [{ id: crypto.randomUUID(), name: file.name, size: file.size, uploadedAt: new Date().toISOString() }, ...current.documents],
    })),
    addChat: (question: string) => update((current) => ({
      ...current,
      chats: [
        ...current.chats,
        { id: crypto.randomUUID(), role: "user", message: question },
        { id: crypto.randomUUID(), role: "assistant", message: current.documents.length
          ? `I found ${current.documents.length} document${current.documents.length === 1 ? "" : "s"} in your local knowledge workspace. Connect the RAG API to return grounded answers and citations.`
          : "No documents have been uploaded yet. Upload a document so the knowledge service can index it." },
      ],
    })),
    signIn: (email: string) => update((current) => ({ ...current, user: { email, name: email.split("@")[0].replace(/[._-]/g, " ") || "User" } })),
  };
}
