"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  documentApi, ApiError,
  type DocumentData, type DocumentType, type Confidentiality, type AccessScope,
} from "@/lib/api";

const DOCUMENT_TYPES: DocumentType[] = ["SOP", "HR_POLICY", "PROJECT_MANUAL", "ENGINEERING_GUIDE", "SALES_DOCUMENT", "OTHER"];
const CONFIDENTIALITY_LEVELS: Confidentiality[] = ["PUBLIC", "INTERNAL", "CONFIDENTIAL", "RESTRICTED"];
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);

  const canUpload = user?.role === "ADMIN" || user?.role === "KNOWLEDGE_OWNER";

  useEffect(() => {
    if (!canUpload) return;
    documentApi.list().then(setDocuments).catch(() => {});
  }, [canUpload]);

  useEffect(() => {
    if (user) {
      setDepartment(user.department);
      setOwner(user.name);
    }
  }, [user]);

  async function handleUpload() {
    if (!selectedFile) { setError("Please select a file."); return; }
    if (!title.trim()) { setError("Please enter a document title."); return; }

    setError(null); setSuccess(null); setUploading(true);
    try {
      const doc = await documentApi.upload(selectedFile, {
        title, department, owner,
        document_type: documentType, confidentiality, access_scope: accessScope,
      });
      setDocuments((prev) => [doc, ...prev]);
      setSuccess(`"${doc.title}" uploaded successfully.`);
      setSelectedFile(null); setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  if (authLoading) return null;

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold">Upload Documents</h1>
          <Link href="/dashboard" className="text-sm font-medium text-blue-700 hover:underline">
            Back to dashboard
          </Link>
        </div>

        {!canUpload ? (
          <div className="mt-8 rounded-xl bg-white p-8 text-center shadow">
            <p className="text-slate-600">
              Document upload is restricted to Knowledge Owners and Admins.
              Your account role is <span className="font-semibold">{user?.role ?? "unknown"}</span>.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 rounded-xl bg-white p-8 shadow-xl">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block font-semibold">File</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    className="w-full rounded-lg border p-3"
                  />
                  {selectedFile && <p className="mt-2 text-green-600">Selected: {selectedFile.name}</p>}
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
                    <input value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full rounded-lg border p-3" />
                  </div>
                  <div>
                    <label className="mb-2 block font-semibold">Owner</label>
                    <input value={owner} onChange={(e) => setOwner(e.target.value)} className="w-full rounded-lg border p-3" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-2 block font-semibold">Type</label>
                    <select value={documentType} onChange={(e) => setDocumentType(e.target.value as DocumentType)} className="w-full rounded-lg border p-3">
                      {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block font-semibold">Confidentiality</label>
                    <select value={confidentiality} onChange={(e) => setConfidentiality(e.target.value as Confidentiality)} className="w-full rounded-lg border p-3">
                      {CONFIDENTIALITY_LEVELS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block font-semibold">Access</label>
                    <select value={accessScope} onChange={(e) => setAccessScope(e.target.value as AccessScope)} className="w-full rounded-lg border p-3">
                      {ACCESS_SCOPES.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
                {success && <p className="text-sm text-green-600" role="status">{success}</p>}

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Upload Document"}
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold">Documents ({documents.length})</h2>
              {documents.length === 0 ? (
                <p className="text-sm text-slate-500">No documents uploaded yet.</p>
              ) : (
                <ul className="space-y-2 text-sm text-slate-600">
                  {documents.map((doc) => (
                    <li key={doc.id} className="rounded-lg bg-white p-3 shadow-sm flex items-center justify-between">
                      <span>{doc.title}</span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          doc.status === "COMPLETED" ? "bg-green-100 text-green-700"
                          : doc.status === "FAILED" ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
