"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSiteSettings } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/image-upload";
import { ThemeEditor } from "@/components/admin/theme-editor";
import { DEFAULT_LANDING, DEFAULT_THEME } from "@/lib/config";
import type { SiteSettings, LandingContent, ThemeSettings } from "@/lib/types";

type SiteConfig = SiteSettings["site"] & Record<string, unknown>;

export function SettingsForm({ initial }: { initial: SiteSettings | null }) {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteConfig>(
    (initial?.site as SiteConfig) ?? {
      name: "Fashion",
      tagline: "",
      description: "",
      domain: "",
      logo_url: null,
      og_image: null,
      keywords: "",
      socials: {},
    }
  );
  const [landing, setLanding] = useState<LandingContent>(
    (settings.landing as LandingContent | undefined) ?? DEFAULT_LANDING
  );
  const [theme, setTheme] = useState<ThemeSettings>(
    (settings.theme as ThemeSettings | undefined) ?? { ...DEFAULT_THEME }
  );
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [isPending, startTransition] = useTransition();

  const socials = (settings.socials ?? {}) as Record<string, string>;

  function setField(key: string, value: unknown) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function setSocial(key: string, value: string) {
    setSettings((prev) => ({
      ...prev,
      socials: { ...((prev.socials as Record<string, string>) ?? {}), [key]: value },
    }));
  }

  function setHero(patch: Partial<LandingContent["hero"]>) {
    setLanding((prev) => ({ ...prev, hero: { ...prev.hero, ...patch } }));
  }

  function setAbout(patch: Partial<LandingContent["about"]>) {
    setLanding((prev) => ({ ...prev, about: { ...prev.about, ...patch } }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("settings", JSON.stringify({ ...settings, landing, theme }));
    setOk(false);
    startTransition(async () => {
      const res = await updateSiteSettings({ ok: false }, fd);
      if (res.ok) {
        setOk(true);
        router.refresh();
      } else {
        setError(res.error || "Gagal menyimpan.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-5">
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      {ok && (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          Pengaturan tersimpan. Website sudah di-update.
        </p>
      )}

      <Fieldset title="Info Website & SEO Global">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama Website">
            <input
              className="input"
              value={settings.name ?? ""}
              onChange={(e) => setField("name", e.target.value)}
            />
          </Field>
          <Field label="Tagline">
            <input
              className="input"
              value={settings.tagline ?? ""}
              onChange={(e) => setField("tagline", e.target.value)}
            />
          </Field>
          <Field label="Deskripsi (meta description)">
            <textarea
              className="textarea"
              rows={3}
              value={settings.description ?? ""}
              onChange={(e) => setField("description", e.target.value)}
            />
          </Field>
          <Field label="Domain (mis. https://fashion.com)">
            <input
              className="input"
              value={settings.domain ?? ""}
              onChange={(e) => setField("domain", e.target.value)}
              placeholder="https://fashion.com"
            />
          </Field>
          <Field label="Keywords (dipisah koma)">
            <input
              className="input"
              value={settings.keywords ?? ""}
              onChange={(e) => setField("keywords", e.target.value)}
            />
          </Field>
          <Field label="Logo">
            <ImageUpload
              value={(settings.logo_url as string) ?? ""}
              onChange={(url) => setField("logo_url", url)}
            />
          </Field>
          <Field label="OG Image (thumbnail sharing)">
            <ImageUpload
              value={(settings.og_image as string) ?? ""}
              onChange={(url) => setField("og_image", url)}
            />
          </Field>
        </div>
      </Fieldset>

      <Fieldset title="Sosial Media">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Instagram">
            <input
              className="input"
              value={socials.instagram ?? ""}
              onChange={(e) => setSocial("instagram", e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </Field>
          <Field label="TikTok">
            <input
              className="input"
              value={socials.tiktok ?? ""}
              onChange={(e) => setSocial("tiktok", e.target.value)}
              placeholder="https://tiktok.com/@..."
            />
          </Field>
          <Field label="YouTube">
            <input
              className="input"
              value={socials.youtube ?? ""}
              onChange={(e) => setSocial("youtube", e.target.value)}
            />
          </Field>
          <Field label="Facebook">
            <input
              className="input"
              value={socials.facebook ?? ""}
              onChange={(e) => setSocial("facebook", e.target.value)}
            />
          </Field>
        </div>
      </Fieldset>

      <Fieldset title="Visual Theme (Warna Website)">
        <ThemeEditor value={theme} onChange={setTheme} />
        <p className="mt-3 text-xs text-stone-500">
          Warna ini dipakai di seluruh halaman publik (beranda, blog, kategori, dan
          artikel). Simpan agar permanen dan tampil untuk pengunjung.
        </p>
      </Fieldset>

      <Fieldset title="Landing Page — Hero">
        <div className="grid gap-4">
          <Field label="Hero Title">
            <input
              className="input"
              value={landing.hero.title}
              onChange={(e) => setHero({ title: e.target.value })}
            />
          </Field>
          <Field label="Hero Subtitle">
            <textarea
              className="textarea"
              rows={2}
              value={landing.hero.subtitle}
              onChange={(e) => setHero({ subtitle: e.target.value })}
            />
          </Field>
          <Field label="Hero Image">
            <ImageUpload
              value={landing.hero.image ?? ""}
              onChange={(url) => setHero({ image: url })}
            />
          </Field>
        </div>
      </Fieldset>

      <Fieldset title="Landing Page — Tentang">
        <div className="grid gap-4">
          <Field label="Judul (mis. Tentang Kami)">
            <input
              className="input"
              value={landing.about.title}
              onChange={(e) => setAbout({ title: e.target.value })}
            />
          </Field>
          <Field label="Konten">
            <textarea
              className="textarea"
              rows={4}
              value={landing.about.content}
              onChange={(e) => setAbout({ content: e.target.value })}
            />
          </Field>
          <Field label="Gambar">
            <ImageUpload
              value={landing.about.image ?? ""}
              onChange={(url) => setAbout({ image: url })}
              label="Upload Gambar Tentang"
            />
            <p className="mt-1.5 text-xs text-stone-500">
              Jika kosong, tampil kotak placeholder berisi nama situs.
            </p>
          </Field>
        </div>
      </Fieldset>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}

function Fieldset({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <h2 className="mb-4 text-sm font-semibold text-stone-900">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}