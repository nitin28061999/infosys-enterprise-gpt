export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
        IA
      </div>

      <div>
        <h1 className="text-lg font-bold text-slate-900">
          Infosys AI
        </h1>

        <p className="text-xs text-slate-500">
          Enterprise GPT
        </p>
      </div>
    </div>
  );
}