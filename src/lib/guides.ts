export type Guide = {
  title: string;
  intro: string;
  steps: { title: string; description: string }[];
};

export const GUIDE_KATEGORI: Guide = {
  title: "Panduan Penggunaan Kategori",
  intro:
    "Kategori digunakan untuk mengelompokkan artikel agar memudahkan pembaca menemukan konten yang relevan.",
  steps: [
    {
      title: "Buat kategori baru",
      description:
        "Klik tombol \u201c+ Tambah Kategori\u201d, lalu isi nama kategori seperti \u201cCelana\u201d, \u201cKemeja\u201d, atau \u201cAksesori\u201d.",
    },
    {
      title: "Slug dibuat otomatis",
      description:
        "Slug URL (contoh: /kategori/celana) otomatis dibuat dari nama. Kamu bisa mengubahnya manual jika ingin URL yang lebih spesifik.",
    },
    {
      title: "Lengkapi deskripsi & SEO",
      description:
        "Isi deskripsi untuk tampilan di halaman kategori, serta SEO title dan description agar kategori mudah ditemukan di mesin pencari.",
    },
    {
      title: "Simpan kategori",
      description:
        "Setelah disimpan, kategori langsung muncul di menu navigasi blog dan halaman /kategori.",
    },
    {
      title: "Pakai di artikel",
      description:
        "Saat menulis atau mengedit artikel, pilih kategori ini dari dropdown \u201cKategori\u201d. Artikel akan otomatis tampil di halaman kategori tersebut.",
    },
    {
      title: "Kelola kategori",
      description:
        "Edit atau hapus kategori lewat tombol di tabel. Menghapus kategori tidak menghapus artikelnya \u2014 artikel tinggal diatur ulang kategorinya.",
    },
  ],
};

export const GUIDE_HALAMAN: Guide = {
  title: "Panduan Penggunaan Halaman",
  intro:
    "Halaman adalah konten statis seperti \u201cTentang Kami\u201d, \u201cKontak\u201d, atau \u201cKebijakan Privasi\u201d yang berdiri sendiri (bukan bagian dari blog).",
  steps: [
    {
      title: "Buat halaman baru",
      description:
        "Klik tombol \u201c+ Tambah Halaman\u201d. Contoh halaman umum: Tentang Kami, Kontak, Kebijakan Privasi, atau Syarat & Ketentuan.",
    },
    {
      title: "Isi judul & slug",
      description:
        "Judul adalah nama halaman. Slug menentukan URL akhir, contoh: /kontak. Slug otomatis dibuat dari judul dan bisa diedit manual.",
    },
    {
      title: "Tulis konten",
      description:
        "Gunakan editor untuk menulis isi halaman. Kamu bisa menambahkan heading, link, gambar, dan format teks lainnya.",
    },
    {
      title: "Lengkapi SEO (opsional)",
      description:
        "Isi SEO title & description agar halaman tampil menarik di hasil pencarian. Jika dikosongkan, sistem memakai judul dan konten sebagai default.",
    },
    {
      title: "Publish atau draft",
      description:
        "Centang \u201cDipublikasikan\u201d agar halaman langsung tampil di situs. Biarkan tidak dicentang untuk menyimpan sebagai draft.",
    },
    {
      title: "Cek hasilnya",
      description:
        "Halaman yang sudah di-publish otomatis muncul di footer situs. URL-nya bisa diakses langsung, contoh: /kontak.",
    },
  ],
};