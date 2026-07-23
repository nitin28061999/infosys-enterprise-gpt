"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function UploadError({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    console.error("Upload Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">

        <div className="mb-6 text-center">
          <div className="mb-4 text-6xl">⚠️</div>

          <h1 className="text-3xl font-bold text-slate-800">
            Upload Failed
          </h1>

          <p className="mt-3 text-slate-600">
            Something went wrong while uploading your document.
          </p>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 font-semibold text-red-700">
            Error Details
          </h2>

          <p className="break-all text-sm text-red-600">
            {error.message || "Unknown error occurred."}
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-4">

          <button
            onClick={() => reset()}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = "/upload")}
            className="rounded-lg border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
          >
            Back to Upload
          </button>

        </div>

      </div>
    </div>
  );
}