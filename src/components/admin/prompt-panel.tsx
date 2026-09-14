"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  buildArticlePrompt,
  DEFAULT_PROMPT_TEMPLATE,
  type Affiliate,
} from "@/lib/prompt-template";

const LS_TEMPLATE_KEY = "fashion.prompt-template";
const LS_AFFILIATE_KEY = "fashion.prompt-affiliates";

export function PromptPanel({
  initialTopic = "",
}: {
  initialTopic?: string;
}) {
  const [topic, setTopic] = useState(initialTopic);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [template, setTemplate] = useState(DEFAULT_PROMPT_TEMPLATE);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const t = localStorage.getItem(LS_TEMPLATE_KEY);
      if (t) setTemplate(t);
      const a = localStorage.getItem(LS_AFFILIATE_KEY);
      if (a) setAffiliates(JSON.parse(a));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_TEMPLATE_KEY, template);
    } catch {}
  }, [template, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_AFFILIATE_KEY, JSON.stringify(affiliates));
    } catch {}
  }, [affiliates, hydrated]);

  const finalPrompt = useMemo(
    () =>
      buildArticlePrompt({
        template,
        topik: topic,
        affiliates: affiliates.filter((a) => a.nama.trim() && a.url.trim()),
      }),
    [template, topic, affiliates]
  );

  function addAffiliate() {
    setAffiliates((prev) => [...prev, { nama: "", url: "" }]);
  }

  function updateAffiliate(
    index: number,
    field: keyof Affiliate,
    value: string
  ) {
    setAffiliates((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  }

  function removeAffiliate(index: number) {
    setAffiliates((prev) => prev.filter((_, i) => i !== index));
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(finalPrompt);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
    }
  }

  const topicQuery = topic.trim()
    ? `?topik=${encodeURIComponent(topic.trim())}`
    : "";
  const filledCount = affiliates.filter(
    (a) => a.nama.trim() && a.url.trim()
  ).length;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* KIRI: input */}
      <div className="space-y-6">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-stone-900">Topik</h2>
          <input
            className="input mt-2"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Contoh: cara memilih celana cargo hitam untuk pria"
          />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-900">
              Link Afiliasi <span className="font-normal text-stone-400">(opsional)</span>
            </h2>
            <button
              type="button"
              className="text-sm font-semibold text-stone-900 hover:underline"
              onClick={addAffiliate}
            >
              + Tambah
            </button>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            Kosongkan jika belum ada. Nama &amp; URL yang terisi otomatis
            dimasukkan ke prompt.
          </p>

          {affiliates.length === 0 ? (
            <p className="mt-3 rounded-lg bg-stone-50 p-3 text-sm text-stone-400">
              Belum ada link afiliasi ({filledCount} terisi).
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {affiliates.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <input
                    className="input flex-1"
                    value={a.nama}
                    onChange={(e) => updateAffiliate(i, "nama", e.target.value)}
                    placeholder="Nama produk"
                  />
                  <input
                    className="input flex-1"
                    type="url"
                    value={a.url}
                    onChange={(e) => updateAffiliate(i, "url", e.target.value)}
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    className="mt-1 text-lg text-stone-400 hover:text-stone-700"
                    onClick={() => removeAffiliate(i)}
                    aria-label="Hapus"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-900">
              Template Prompt
            </h2>
            <button
              type="button"
              className="text-xs text-stone-400 hover:text-stone-700"
              onClick={() => setTemplate(DEFAULT_PROMPT_TEMPLATE)}
            >
              Reset ke bawaan
            </button>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            Bisa diedit; tersimpan otomatis di browser.
          </p>
          <textarea
            className="textarea mt-3 h-64 font-mono text-xs"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />
        </div>
      </div>

      {/* KANAN: hasil + aksi */}
      <div className="space-y-6">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-stone-900">
            Prompt Siap Pakai
          </h2>
          <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-stone-900 p-4 text-xs leading-relaxed text-stone-100">
            {finalPrompt.trim() || (
              <span className="text-stone-400">
                Isi topik dulu untuk membangun prompt.
              </span>
            )}
          </pre>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn-primary"
              onClick={copyPrompt}
              disabled={!topic.trim()}
            >
              {copied ? "Tersalin!" : "Salin Prompt"}
            </button>
            <Link className="btn-ghost" href={`/admin/artikel/baru${topicQuery}`}>
              Buka Form Artikel
            </Link>
          </div>
          {copyError && (
            <p className="mt-2 text-xs text-red-600">
              Gagal menyalin otomatis — blok &amp; salin manual dari kotak
              prompt di atas.
            </p>
          )}
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold text-stone-900">
            Langkah Penggunaan
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-stone-600">
            <li>Isi topik artikel.</li>
            <li>
              Tambahkan link afiliasi (opsional) jika ada — otomatis masuk ke
              prompt.
            </li>
            <li>Klik <strong>Salin Prompt</strong> lalu tempel ke AI eksternal.</li>
            <li>
              Klik <strong>Buka Form Artikel</strong> — judul &amp; slug
              terisi otomatis dari topik. Tempel hasil artikel dari AI dan
              publish.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
