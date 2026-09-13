-- =============================================================
-- Fashion SEO Website — Supabase schema
-- Jalankan di Supabase > SQL Editor
-- =============================================================

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Articles
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content_json jsonb,
  content_html text,
  cover_image text,
  status text not null default 'draft' check (status in ('draft','published')),
  seo_title text,
  seo_description text,
  seo_keywords text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_slug_idx on public.articles(slug);
create index if not exists articles_status_idx on public.articles(status);
create index if not exists articles_published_at_idx on public.articles(published_at desc);

-- Custom static pages (tentang, kontak, etc.)
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content_html text,
  content_json jsonb,
  published boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Site-wide settings (JSON, key = 'site')
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Admin users (hubungkan dengan Supabase Auth email)
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

-- =============================================================
-- RLS (Row Level Security)
-- =============================================================
alter table public.articles enable row level security;
alter table public.categories enable row level security;
alter table public.pages enable row level security;
alter table public.site_settings enable row level security;

-- Service role & anon bisa agnostik; policies berikut melindungi data privat
create policy "public read published articles" on public.articles
  for select to anon, authenticated using (status = 'published');

create policy "public read categories" on public.categories
  for select to anon, authenticated using (true);

create policy "public read published pages" on public.pages
  for select to anon, authenticated using (published = true);

create policy "public read site settings" on public.site_settings
  for select to anon, authenticated using (true);

-- =============================================================
-- Seed default settings
-- =============================================================
insert into public.site_settings (key, value)
values (
  'site',
  '{
    "name": "Fashion",
    "tagline": "Inspirasi Fashion & Gaya Hidup",
    "description": "Inspirasi, tips, dan panduan fashion terkini untuk gaya hidup harianmu.",
    "domain": "",
    "logo_url": null,
    "og_image": null,
    "keywords": "fashion, style, tren, pakaian, gaya hidup",
    "socials": {},
    "landing": {
      "hero": {
        "title": "Temukan Gaya Fesyen Terbaikmu",
        "subtitle": "Inspirasi, tips, dan panduan fashion terkini untuk gaya hidup harianmu.",
        "image": null,
        "cta_text": "Jelajahi Artikel",
        "cta_link": "/blog"
      },
      "about": {
        "title": "Tentang Kami",
        "content": "Kami menghadirkan konten seputar fashion, tren terkini, dan gaya hidup yang menginspirasi.",
        "image": null
      },
      "features": {
        "title": "Kenapa Memilih Kami",
        "subtitle": "Konten berkualitas yang menginspirasi gaya hidupmu",
        "items": [
          { "title": "Tren Terbaru", "description": "Selalu update dengan tren fashion terbaru setiap musim." },
          { "title": "Tips Terpercaya", "description": "Panduan memilih dan memadukan busana untuk berbagai acara." },
          { "title": "Konten Berkualitas", "description": "Artikel yang ditulis dengan riset mendalam dan mudah dibaca." }
        ]
      },
      "newsletter": {
        "title": "Berlangganan Newsletter",
        "subtitle": "Dapatkan tips fashion terbaru langsung di email kamu."
      }
    }
  }'
)
on conflict (key) do nothing;

-- =============================================================
-- Storage bucket untuk gambar
-- =============================================================
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "public read images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'images');