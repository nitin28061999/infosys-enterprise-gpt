"use client";

import Link from "next/link";
import { useEnterpriseData } from "@/lib/enterprise-store";

export default function AnalyticsPage() {
  const { data } = useEnterpriseData();
  const questions = data.chats.filter((item) => item.role === "user").length;
  const answers = data.chats.filter((item) => item.role === "assistant").length;
  return <main className="min-h-screen bg-slate-100 p-6 md:p-10"><div className="mx-auto max-w-6xl"><header className="flex items-start justify-between gap-4"><div><h1 className="text-3xl font-bold">Analytics</h1><p className="mt-1 text-slate-600">Live counts from this browser's demo workspace.</p></div><Link href="/dashboard" className="text-sm font-medium text-blue-700 hover:underline">Dashboard</Link></header><div className="mt-8 grid gap-5 sm:grid-cols-3"><Metric label="Documents" value={data.documents.length} /><Metric label="Questions" value={questions} /><Metric label="Generated responses" value={answers} /></div><section className="mt-8 rounded-xl bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Activity</h2>{data.documents.length || data.chats.length ? <ul className="mt-4 divide-y">{[...data.documents.map((item) => ({ id: item.id, label: `Uploaded ${item.name}`, at: item.uploadedAt })), ...data.chats.filter((item) => item.role === "user").map((item) => ({ id: item.id, label: `Asked: ${item.message}`, at: "Current session" }))].slice(0, 10).map((item) => <li key={item.id} className="py-3"><p>{item.label}</p><p className="text-sm text-slate-500">{item.at}</p></li>)}</ul> : <p className="mt-4 text-slate-600">No workspace activity yet.</p>}</section><p className="mt-5 text-sm text-slate-500">For production analytics, connect this view to your secure usage and audit APIs.</p></div></main>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>; }
