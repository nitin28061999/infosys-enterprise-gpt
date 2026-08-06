"use client";

import { useRef, useState } from "react";

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    setUploading(true);

    try {
      // Backend integration will go here
      console.log({
        file: selectedFile,
        department,
        description,
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Document uploaded successfully.");

      setSelectedFile(null);
      setDepartment("");
      setDescription("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">

        <h1 className="mb-2 text-3xl font-bold">
          Upload Knowledge Document
        </h1>

        <p className="mb-8 text-slate-600">
          Upload enterprise documents for AI knowledge retrieval.
        </p>

        <div className="space-y-6">

          <div>
            <label className="mb-2 block font-semibold">
              Select File
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="w-full rounded-lg border p-3"
            />

            {selectedFile && (
              <p className="mt-2 text-green-600">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Department
            </label>

            <select
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            >
              <option value="">Select Department</option>
              <option>HR</option>
              <option>Engineering</option>
              <option>Sales</option>
              <option>Finance</option>
              <option>Operations</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Enter document description..."
              className="w-full rounded-lg border p-3"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {uploading
              ? "Uploading..."
              : "Upload Document"}
          </button>

        </div>
      </div>
    </main>
  );
}