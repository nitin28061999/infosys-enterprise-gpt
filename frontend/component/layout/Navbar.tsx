export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b bg-white px-8 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-blue-600">
        Infosys AI Knowledge Assistant
      </h1>

      <div className="flex gap-6">
        <a href="/" className="hover:text-blue-600">
          Home
        </a>

        <a href="/dashboard" className="hover:text-blue-600">
          Dashboard
        </a>

        <a href="/chat" className="hover:text-blue-600">
          Chat
        </a>

        <a href="/login" className="rounded bg-blue-600 px-4 py-2 text-white">
          Login
        </a>
      </div>
    </nav>
  );
}