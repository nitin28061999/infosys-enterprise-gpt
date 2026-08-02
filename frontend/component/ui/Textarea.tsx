import { TextareaHTMLAttributes } from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function Textarea({
  className = "",
  ...props
}: TextareaProps) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}