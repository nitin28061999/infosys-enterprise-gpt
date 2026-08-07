"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useEnterpriseData } from "@/lib/enterprise-store";

export default function ChatPage() {
  const { data, addChat } = useEnterpriseData();
  const [question, setQuestion] = useState("");
  const submit = (event: FormEvent) => { event.preventDefault(); if (!question.trim()) return; addChat(question.trim()); setQuestion(""); };

  return <main className="min-h-screen bg-slate-100 p-6 md:p-10"><div className="mx-auto max-w-5xl"><div className="flex items-start justify-between gap-4"><div><h1 className="text-3xl font-bold">Enterprise GPT</h1><p className="mt-1 text-slate-600">Ask questions over the documents in this workspace.</p></div><Link href="/dashboard" className="text-sm font-medium text-blue-700 hover:underline">Dashboard</Link></div><div className="mt-6 rounded-xl bg-white p-5 shadow-sm"><div className="h-[430px] space-y-4 overflow-y-auto">{data.chats.length ? data.chats.map((chat) => <div key={chat.id} className={`max-w-3xl rounded-xl p-4 ${chat.role === "user" ? "ml-auto bg-blue-600 text-white" : "bg-slate-100 text-slate-900"}`}>{chat.message}</div>) : <p className="rounded-xl bg-slate-100 p-4 text-slate-600">Upload documents, then ask a question. Answers are clearly marked as demo responses until the RAG API is connected.</p>}</div><form onSubmit={submit} className="mt-5 flex gap-3 border-t pt-5"><input value={question} onChange={(event) => setQuestion(event.target.value)} className="min-w-0 flex-1 rounded-lg border p-3" placeholder="Ask about your enterprise knowledge..."/><button className="rounded-lg bg-blue-600 px-5 font-medium text-white hover:bg-blue-700">Send</button></form></div><p className="mt-4 text-sm text-slate-500">{data.documents.length} document{data.documents.length === 1 ? "" : "s"} available locally. <Link href="/upload" className="text-blue-700 hover:underline">Manage uploads</Link></p></div></main>;
}
