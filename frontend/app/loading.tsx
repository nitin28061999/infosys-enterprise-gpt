export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="rounded-xl bg-white p-10 shadow-lg">

        <div className="flex flex-col items-center">

          <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

          <h2 className="text-2xl font-bold text-slate-800">
            Uploading Document...
          </h2>

          <p className="mt-3 text-center text-slate-500">
            Please wait while your file is being uploaded.
          </p>

        </div>

      </div>
    </div>
  );
}