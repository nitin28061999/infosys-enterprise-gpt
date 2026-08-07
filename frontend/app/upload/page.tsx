"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";
import PageHeader from "@/component/common/Pageheader";
import { uploadApi, ApiError, type UploadedDocument } from "@/lib/api";

export default function UploadPage() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    uploadApi
      .listDocuments()
      .then(setDocuments)
      .catch(() => {
        // No documents endpoint yet, or nothing uploaded — leave list empty.
      });
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const doc = await uploadApi.uploadDocument(file);
        setDocuments((prev) => [doc, ...prev]);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-8">
          <PageHeader
            title="Upload Documents"
            description="Add documents to your enterprise knowledge base for AI-powered search."
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={`flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 bg-white hover:bg-slate-50"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            <p className="text-lg font-medium text-slate-800">
              {uploading ? "Uploading..." : "Drag & drop files here"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              or click to browse — PDF, DOCX, TXT supported
            </p>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Recent Uploads
            </h2>

            {documents.length === 0 ? (
              <p className="text-sm text-slate-400">
                No documents uploaded yet.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-left">Filename</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-t hover:bg-slate-50">
                        <td className="px-6 py-4">{doc.filename}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              doc.status === "indexed"
                                ? "bg-green-100 text-green-700"
                                : doc.status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {new Date(doc.uploaded_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
