"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleNotePin } from "@/app/admin/actions";

export function PinButton({
  id,
  pinned,
}: {
  id: string;
  pinned: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const res = await toggleNotePin(id);
      if (res.ok) router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleToggle}
      aria-pressed={pinned}
      aria-label={pinned ? "Lepas sematan" : "Sematkan catatan"}
      title={pinned ? "Lepas sematan" : "Sematkan catatan"}
      className={`rounded-lg p-1.5 transition-colors disabled:opacity-50 ${
        pinned
          ? "text-accent hover:bg-accent/10"
          : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"
      }`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={pinned ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 17v5" />
        <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
      </svg>
    </button>
  );
}
