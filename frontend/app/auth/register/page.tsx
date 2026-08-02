"use client";

export default function RegisterPage() {
  return (
    <div className="bg-white p-8 rounded shadow w-96">

      <h1 className="text-2xl font-bold mb-6">
        Create Account
      </h1>

      <input
        className="border w-full p-2 mb-3"
        placeholder="Full Name"
      />

      <input
        className="border w-full p-2 mb-3"
        placeholder="Email"
      />

      <input
        className="border w-full p-2 mb-3"
        type="password"
        placeholder="Password"
      />

      <button
        className="bg-green-600 text-white w-full p-2 rounded"
      >
        Register
      </button>

    </div>
  );
}