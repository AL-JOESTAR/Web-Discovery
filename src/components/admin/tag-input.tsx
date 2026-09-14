"use client";
import { useState } from "react";

export function TagInput({
  value,
  onChange,
  placeholder = "Ketik tag lalu Enter...",
}: {
  value: string;
  onChange: (tags: string) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const tags = value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  function addTag(raw: string) {
    const tag = raw
      .replace(/,/g, "")
      .trim()
      .toLowerCase();
    if (!tag) return;
    if (!tags.includes(tag)) {
      onChange([...tags, tag].join(", "));
    }
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag).join(", "));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-2 py-1.5 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-stone-400 transition-colors hover:text-red-600"
              aria-label={`Hapus tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className="min-w-[120px] flex-1 border-none bg-transparent px-1 py-1 text-sm text-stone-900 outline-none placeholder:text-stone-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(input)}
          placeholder={tags.length === 0 ? placeholder : ""}
        />
      </div>
    </div>
  );
}