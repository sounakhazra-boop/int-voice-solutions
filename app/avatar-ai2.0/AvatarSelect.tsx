// components/video-studio/AvatarSelect.tsx
// import type { AvatarOption } from "@/types/heygen";
import type { AvatarOption } from "./heygen-types";

type Props = {
  avatars: AvatarOption[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
};

export default function AvatarSelect({
  avatars,
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      Avatar
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || avatars.length === 0}
        className="rounded-md border border-neutral-300 bg-transparent p-2 dark:border-neutral-700"
      >
        {avatars.map((a) => (
          <option key={a.avatar_id} value={a.avatar_id}>
            {a.name}
          </option>
        ))}
      </select>
    </label>
  );
}
