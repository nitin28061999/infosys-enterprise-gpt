"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  placeholder = "Search...",
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative w-full">

      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
      />

    </div>
  );
}