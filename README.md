# Fashion — Website SEO + Admin Panel

Website fashion dengan SEO-optimized frontend dan panel admin untuk menulis
konten (artikel, kategori, halaman statis, pengaturan) dengan editor rich text.

- **Frontend**: Next.js 16 + Tailwind CSS v4, distribusi statis (Vercel/Netlify)
- **Database**: Supabase (PostgreSQL) — RLS + service role untuk admin
- **Auth**: Supabase Auth (email + password), route di-lindungi `src/proxy.ts`
- **Caching**: Cache Components (`use cache`) dengan tag revalidation

## Persiapan

### 1. Supabase

1. Buat project di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan seluruh isi `supabase/schema.sql`.
   (membuat tabel `articles`, `categories`, `pages`, `site_settings`, `admins`,
   storage bucket `images`, seed pengaturan default, + policy RLS).
3. Salin `Supabase URL`, `anon key`, dan `service_role key` dari
   **Project Settings → API**.
4. Buat bucket storage `images` **public** (sudah dibuat otomatis oleh schema).

### 2. Environment

```bash
cp .env.example .env.local
```

Isi `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> `NEXT_PUBLIC_SITE_URL` dipakai untuk sitemap & canonical. Saat deploy, isi
> dengan URL produksi.

### 3. Login Admin

Buka **Authentication → Users** di dashboard Supabase > **Add user**:
- Email & password untuk akun admin.

Jalankan SQL berikut untuk menandai pengguna sebagai admin:

```sql
insert into public.admins (email)
values ('email-anda@contoh.com')
on conflict (email) do nothing;
```

Login di `/admin/login`.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build produksi
npm run lint       # eslint
```

## Struktur Folder

- `src/app/` — halaman publik (`/`, `/blog`, `/kategori`, `/[slug]`) & admin
  (`/admin/*`)
- `src/lib/` — `db.ts` (data publik + cache), `admin-db.ts` (data admin),
  `seo.ts` (JSON-LD), `supabase/` (client), `config.ts` (konstanta + env guard)
- `src/components/site/` — navbar, footer, article-card
- `src/components/admin/` — form artikel/kategori/halaman, rich-text editor,
  image upload, settings
- `src/proxy.ts` — guard auth untuk rute `/admin/*`
- `supabase/schema.sql` — skema database + seed

## Backup / restore

```bash
# Backup via Supabase CLI
supabase db dump
```

## Deploy (Vercel)

1. Push ke GitHub, import repo di Vercel.
2. Set kelima environment variable di atas pada **Environment Variables**.
3. Deploy. Rute publik otomatis di-prerender; `/admin/*` server-rendered
   (login-protected).