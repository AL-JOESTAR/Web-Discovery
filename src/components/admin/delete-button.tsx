"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteArticle, deleteCategory, deletePage } from "@/app/admin/actions";

type Kind = "article" | "category" | "page";

export function DeleteButton({
  id,
  kind = "article",
  confirmText = "Hapus data ini?",
}: {
  id: string;
  kind?: Kind;
  confirmText?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    startTransition(async () => {
      const fn =
        kind === "article"
          ? deleteArticle
          : kind === "category"
            ? deleteCategory
            : deletePage;
      const res = await fn(id);
      if (res.ok) router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className={`text-xs font-medium ${
        confirming
          ? "rounded-full bg-red-600 px-3 py-1 text-white"
          : "text-red-600 hover:underline"
      }`}
    >
      {isPending
        ? "Menghapus..."
        : confirming
          ? confirmText
          : "Hapus"}
    </button>
  );
}