import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-wide flex flex-col items-center py-28 text-center sm:py-36">
      <p className="font-serif text-7xl font-bold text-accent sm:text-8xl">404</p>
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-3 max-w-md text-muted">
        Halaman yang kamu cari tidak ada atau sudah dihapus.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
