"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";
import PageHeader from "@/component/common/Pageheader";
import { useAuth } from "@/lib/auth-context";
import {
  documentApi,
  ApiError,
  type DocumentData,
  type DocumentType,
  type Confidentiality,
  type AccessScope,
} from "@/lib/api";

const DOCUMENT_TYPES: DocumentType[] = [
  "SOP",
  "HR_POLICY",
  "PROJECT_MANUAL",
  "ENGINEERING_GUIDE",
  "SALES_DOCUMENT",
  "OTHER",
];
const CONFIDENTIALITY_LEVELS: Confidentiality[] = [
  "PUBLIC",
  "INTERNAL",
  "CONFIDENTIAL",
  "RESTRICTED",
];
const ACCESS_SCOPES: AccessScope[] = ["ALL", "DEPARTMENT", "OWNER"];

export default function UploadPage() {
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [owner, setOwner] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("OTHER");
  const [confidentiality, setConfidentiality] = useState<Confidentiality>("INTERNAL");
  const [accessScope, setAccessScope] = useState<AccessScope>("DEPARTMENT");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);

  const canUpload = user?.role === "ADMIN" || user?.role === "KNOWLEDGE_OWNER";

  useEffect(() => {
    if (!canUpload) return;
    documentApi
      .list()
      .then(setDocuments)
      .catch(() => {
        // Leave list empty on failure.
      });
  }, [canUpload]);

  useEffect(() => {
    if (user) {
      setDepartment(user.department);
      setOwner(user.name);
    }
  }, [user]);

  function pickFile(file: File | undefined | null) {
    if (file) setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a document title.");
      return;
    }

    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const doc = await documentApi.upload(selectedFile, {
        title,
        department,
        owner,
        document_type: documentType,
        confidentiality,
        access_scope: accessScope,
      });

      setDocuments((prev) => [doc, ...prev]);
      setSuccess(`"${doc.title}" uploaded successfully.`);
      setSelectedFile(null);
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  if (authLoading) return null;

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-8">
          <PageHeader
            title="Upload Knowledge Document"
            description="Upload enterprise documents for AI knowledge retrieval."
          />

          {!canUpload ? (
            <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow text-center">
              <p className="text-slate-600">
                Document upload is restricted to Knowledge Owners and Admins.
                Your account role is{" "}
                <span className="font-semibold">{user?.role ?? "unknown"}</span>.
              </p>
            </div>
          ) : (
            <>
              <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
                <div className="space-y-5">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      pickFile(e.dataTransfer.files?.[0]);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <label className="mb-2 block font-semibold">File</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={(e) => pickFile(e.target.files?.[0])}
                      className="w-full rounded-lg border p-3"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {selectedFile ? (
                      <p className="mt-2 text-green-600">
                        Selected: {selectedFile.name}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        or drag & drop a file here
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Q3 Engineering Onboarding Guide"
                      className="w-full rounded-lg border p-3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block font-semibold">Department</label>
                      <input
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full rounded-lg border p-3"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold">Owner</label>
                      <input
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        className="w-full rounded-lg border p-3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="mb-2 block font-semibold">Type</label>
                      <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                        className="w-full rounded-lg border p-3"
                      >
                        {DOCUMENT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold">
                        Confidentiality
                      </label>
                      <select
                        value={confidentiality}
                        onChange={(e) =>
                          setConfidentiality(e.target.value as Confidentiality)
                        }
                        className="w-full rounded-lg border p-3"
                      >
                        {CONFIDENTIALITY_LEVELS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold">Access</label>
                      <select
                        value={accessScope}
                        onChange={(e) => setAccessScope(e.target.value as AccessScope)}
                        className="w-full rounded-lg border p-3"
                      >
                        {ACCESS_SCOPES.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  )}
                  {success && (
                    <p className="text-sm text-green-600" role="status">
                      {success}
                    </p>
                  )}

                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {uploading ? "Uploading..." : "Upload Document"}
                  </button>
                </div>
              </div>

              <div className="mx-auto mt-8 max-w-3xl">
                <h2 className="mb-4 text-xl font-semibold text-slate-800">
                  Documents
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
                          <th className="px-6 py-3 text-left">Title</th>
                          <th className="px-6 py-3 text-left">Status</th>
                          <th className="px-6 py-3 text-left">Uploaded</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map((doc) => (
                          <tr key={doc.id} className="border-t hover:bg-slate-50">
                            <td className="px-6 py-4">{doc.title}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  doc.status === "COMPLETED"
                                    ? "bg-green-100 text-green-700"
                                    : doc.status === "FAILED"
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
            </>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
