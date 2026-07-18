import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-6">
      <h1 className="text-5xl font-bold text-slate-900">
        Infosys AI Knowledge Assistant
      </h1>

      <p className="mt-6 max-w-2xl text-center text-lg text-slate-600">
        Enterprise GPT powered by Retrieval-Augmented Generation (RAG), Google
        Gemini, Supabase, and ChromaDB.
      </p>

      <Link
        href="/login"
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Get Started
      </Link>
    </main>
  );
}