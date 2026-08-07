"use client";

import Link from "next/link";
import { useEnterpriseData } from "@/lib/enterprise-store";

export default function DashboardPage() {
  const { data } = useEnterpriseData();
  const queries = data.chats.filter((chat) => chat.role === "user").length;

  return <main className="min-h-screen bg-slate-100 p-6 md:p-10"><div className="mx-auto max-w-6xl"><header className="flex flex-wrap items-center justify-between gap-4"><div><p className="font-medium text-blue-700">Infosys AI Knowledge Assistant</p><h1 className="text-3xl font-bold text-slate-900">Welcome{data.user ? `, ${data.user.name}` : ""}</h1><p className="mt-1 text-slate-600">Your enterprise knowledge workspace at a glance.</p></div><div className="flex gap-3"><Link href="/upload" className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">Upload documents</Link><Link href="/chat" className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium hover:bg-slate-50">Open AI chat</Link></div></header><section className="mt-8 grid gap-5 sm:grid-cols-3"><Stat label="Documents uploaded" value={data.documents.length} /><Stat label="Questions asked" value={queries} /><Stat label="Workspace status" value={data.documents.length ? "Ready" : "Needs documents"} /></section><section className="mt-8 grid gap-6 lg:grid-cols-2"><div className="rounded-xl bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Recent documents</h2>{data.documents.length ? <ul className="mt-4 space-y-3">{data.documents.slice(0, 5).map((document) => <li key={document.id} className="rounded-lg bg-slate-50 p-3 text-sm"><p className="font-medium">{document.name}</p><p className="mt-1 text-slate-500">Added {new Date(document.uploadedAt).toLocaleString()}</p></li>)}</ul> : <p className="mt-4 text-slate-600">No documents yet. Upload a file to start building the knowledge workspace.</p>}</div><div className="rounded-xl bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Next steps</h2><ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-700"><li>Upload enterprise policy, handbook, or process documents.</li><li>Ask a question in AI Chat.</li><li>Connect your backend to replace this browser-local demo data.</li></ol><Link href="/analytics" className="mt-6 inline-block text-sm font-medium text-blue-700 hover:underline">View analytics →</Link></div></section></div></main>;
}

function Stat({ label, value }: { label: string; value: string | number }) { return <div className="rounded-xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div>; }
﻿
