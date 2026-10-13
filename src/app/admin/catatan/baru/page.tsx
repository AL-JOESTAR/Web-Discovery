import { NoteForm } from "@/components/admin/note-form";

export default function AdminNewNotePage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Tambah Catatan
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Catatan internal yang terlihat oleh semua admin.
      </p>
      <div className="mt-6">
        <NoteForm />
      </div>
    </div>
  );
}
