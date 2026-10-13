import { notFound } from "next/navigation";
import { getNoteById } from "@/lib/admin-db";
import { NoteForm } from "@/components/admin/note-form";

export default async function AdminEditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await getNoteById(id);
  if (!note) notFound();

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Edit Catatan
      </h1>
      <div className="mt-6">
        <NoteForm note={note} />
      </div>
    </div>
  );
}
