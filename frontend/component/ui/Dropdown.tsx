"use client";

import { useState } from "react";

interface DropdownItem {
  label: string;
  onClick?: () => void;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
}

export default function Dropdown({
  label,
  items,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">

      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg border bg-white px-4 py-2 shadow hover:bg-gray-50"
      >
        {label}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border bg-white shadow-lg">

          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
              className="block w-full px-4 py-3 text-left hover:bg-gray-100"
            >
              {item.label}
            </button>
          ))}

        </div>
      )}

    </div>
  );
}