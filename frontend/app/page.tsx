import Link from "next/link";
import Navbar from "../component/layout/Navbar";
import Footer from "../component/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6">
        <h1 className="mb-4 text-center text-6xl font-bold text-slate-900">
          Infosys AI Knowledge Assistant
        </h1>

        <p className="mb-10 max-w-3xl text-center text-lg text-slate-600">
          Enterprise AI powered by Google Gemini, Retrieval-Augmented Generation
          (RAG), Supabase and ChromaDB.
        </p>

        <div className="flex gap-5">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Get Started
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-300 px-6 py-3 hover:bg-slate-100"
          >
            Dashboard
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}