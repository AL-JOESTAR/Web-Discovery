"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({
  redirectTo,
  urlError,
}: {
  redirectTo: string;
  urlError?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.push(redirectTo);
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow">
      <h1 className="text-center font-serif text-2xl font-bold text-stone-900">
        Admin Login
      </h1>
      {(urlError === "unauthorized" || error) && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {urlError === "unauthorized" && !error
            ? "Email belum terdaftar sebagai admin. Daftarkan email ini dulu di tabel admins."
            : error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-60"
        >
          {loading ? "Masuk..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
