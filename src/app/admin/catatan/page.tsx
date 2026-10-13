import Link from "next/link";
import { getAllNotes } from "@/lib/admin-db";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { PinButton } from "@/components/admin/pin-button";

export default async function AdminNotesPage() {
  const notes = await getAllNotes();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Catatan
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {notes.length} catatan tersimpan. Dibagikan ke semua admin.
          </p>
        </div>
        <Link href="/admin/catatan/baru" className="btn-primary">
          + Tambah Catatan
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="font-serif text-lg text-stone-500">
            Belum ada catatan.
          </p>
          <Link href="/admin/catatan/baru" className="btn-primary mt-4">
            Tambah Catatan Pertama
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note.id} className="card flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="min-w-0 break-words font-serif text-base font-semibold text-stone-900">
                  {note.title}
                </h2>
                <PinButton id={note.id} pinned={note.pinned} />
              </div>
              {note.content && (
                <p className="mt-2 line-clamp-5 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                  {note.content}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
                <span className="text-xs text-stone-400">
                  Diperbarui {formatDate(note.updated_at)}
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/catatan/${note.id}`}
                    className="text-xs font-medium text-accent hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    id={note.id}
                    kind="note"
                    confirmText="Hapus catatan ini?"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
