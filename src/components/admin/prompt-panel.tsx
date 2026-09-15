"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  buildArticlePrompt,
  DEFAULT_PROMPT_TEMPLATE,
  type Affiliate,
} from "@/lib/prompt-template";

const LS_TEMPLATE_KEY = "fashion.prompt-template";

export function PromptPanel({
  initialTopic = "",
  savedAffiliates = [],
}: {
  initialTopic?: string;
  savedAffiliates?: Affiliate[];
}) {
  const [topic, setTopic] = useState(initialTopic);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [template, setTemplate] = useState(DEFAULT_PROMPT_TEMPLATE);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const t = localStorage.getItem(LS_TEMPLATE_KEY);
        if (t) setTemplate(t);
      } catch {}
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_TEMPLATE_KEY, template);
    } catch {}
  }, [template, hydrated]);

  const finalPrompt = useMemo(
    () =>
      buildArticlePrompt({
        template,
        topik: topic,
        affiliates,
      }),
    [template, topic, affiliates]
  );

  const availableOptions = useMemo(
    () =>
      savedAffiliates.filter(
        (a) =>
          a.nama.trim() &&
          a.url.trim() &&
          !affiliates.some(
            (s) => s.url === a.url || s.nama.toLowerCase() === a.nama.toLowerCase()
          )
      ),
    [savedAffiliates, affiliates]
  );

  function addSelected(url: string) {
    const found = savedAffiliates.find((a) => a.url === url);
    if (!found) return;
    setAffiliates((prev) =>
      prev.some(
        (s) =>
          s.url === found.url ||
          s.nama.toLowerCase() === found.nama.toLowerCase()
      )
        ? prev
        : [...prev, { nama: found.nama, url: found.url }]
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
            <Link
              href="/admin/affiliate"
              className="text-xs text-stone-400 hover:text-accent"
            >
              Kelola daftar →
            </Link>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            Pilih dari daftar tersimpan. Kosongkan jika belum ada.
          </p>

          {availableOptions.length === 0 ? (
            <p className="mt-3 rounded-lg bg-stone-50 p-3 text-sm text-stone-400">
              {savedAffiliates.length === 0
                ? "Belum ada link afiliasi tersimpan."
                : "Semua link tersimpan sudah terpilih."}
            </p>
          ) : (
            <div className="mt-3">
              <select
                name="affiliate-select"
                className="select w-full"
                value=""
                onChange={(e) => {
                  if (e.target.value) addSelected(e.target.value);
                }}
              >
                <option value="">Pilih link afiliasi...</option>
                {availableOptions.map((a) => (
                  <option key={a.url} value={a.url}>
                    {a.nama}
                  </option>
                ))}
              </select>
            </div>
          )}

          {affiliates.length === 0 ? (
            <p className="mt-3 rounded-lg bg-stone-50 p-3 text-sm text-stone-400">
              Belum ada link afiliasi terpilih.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {affiliates.map((a, i) => (
                <li
                  key={`${a.url}-${i}`}
                  className="flex items-start justify-between gap-2 rounded-lg border border-stone-200 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-800">
                      {a.nama}
                    </p>
                    <p className="truncate text-xs text-stone-400">{a.url}</p>
                  </div>
                  <button
                    type="button"
                    className="mt-0.5 text-lg leading-none text-stone-400 hover:text-stone-700"
                    onClick={() => removeAffiliate(i)}
                    aria-label="Hapus"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
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
              Pilih link afiliasi (opsional) dari daftar tersimpan — otomatis
              masuk ke prompt.
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