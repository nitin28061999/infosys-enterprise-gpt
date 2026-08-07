"use client";

import { useState } from "react";
import Link from "next/link";
import { useEnterpriseData } from "@/lib/enterprise-store";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { data, addDocument } = useEnterpriseData();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    addDocument(file);
    setMessage(`${file.name} has been added to this browser's knowledge workspace.`);
    setFile(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl">

        <div className="flex items-center justify-between gap-4"><h1 className="text-3xl font-semibold">Upload Documents</h1><Link href="/dashboard" className="text-sm font-medium text-blue-700 hover:underline">Back to dashboard</Link></div>
        <p className="mt-2 text-slate-600">Files are recorded locally for this frontend demo. Connect the upload API to persist and index them server-side.</p>

        <div
          className="mt-8 rounded-xl border-2 border-dashed border-slate-300 p-10 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <p>Drag & Drop Documents Here</p>

          <input
            type="file"
            className="mt-4"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />
        </div>

        {file && <div className="mt-4">Selected: {file.name}</div>}
        {message && <p className="mt-4 rounded-lg bg-green-50 p-3 text-green-800">{message}</p>}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        <div className="mt-8 border-t pt-5"><h2 className="font-semibold">Uploaded in this workspace ({data.documents.length})</h2>{data.documents.length ? <ul className="mt-3 space-y-2 text-sm text-slate-600">{data.documents.map((document) => <li key={document.id} className="rounded-lg bg-slate-50 p-3">{document.name} <span className="text-slate-400">• {(document.size / 1024).toFixed(1)} KB</span></li>)}</ul> : <p className="mt-2 text-sm text-slate-500">No documents uploaded yet.</p>}</div>
      </div>
    </div>
  );
}
