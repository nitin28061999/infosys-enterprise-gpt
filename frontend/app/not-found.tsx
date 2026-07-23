import Link from "next/link";

export default function UploadNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">

      <div className="w-full max-w-xl rounded-xl bg-white p-10 text-center shadow-lg">

        <div className="mb-6 text-7xl">
          📄
        </div>

        <h1 className="text-5xl font-bold text-slate-800">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-slate-700">
          Upload Page Not Found
        </h2>

        <p className="mt-4 text-slate-500">
          The upload page you are looking for doesn't exist or has been moved.
        </p>

        <div className="mt-8 flex justify-center gap-4">

          <Link
            href="/dashboard"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Dashboard
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
          >
            Home
          </Link>

        </div>

      </div>

    </div>
  );
}