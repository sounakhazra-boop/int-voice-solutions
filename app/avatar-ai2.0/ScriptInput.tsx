// components/video-studio/ScriptInput.tsx
// import { MAX_SCRIPT_CHARS } from "@/types/heygen";
import { MAX_SCRIPT_CHARS } from "./heygen-types";

type Props = {
  value: string;
  onChange: (text: string) => void;
  disabled?: boolean;
};

export default function ScriptInput({ value, onChange, disabled }: Props) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      Script
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={MAX_SCRIPT_CHARS}
        rows={4}
        placeholder="Welcome to our voice solution. Here's what we can do for you..."
        className="rounded-md border border-neutral-300 bg-transparent p-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      <span className="self-end text-xs text-neutral-500">
        {value.length}/{MAX_SCRIPT_CHARS}
      </span>
    </label>
  );
}
