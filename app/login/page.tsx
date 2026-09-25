"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(name, email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-accent" />
          <span className="font-display font-bold text-xl text-ink">TaskFlow</span>
        </div>

        <div className="bg-surface border border-line rounded-xl2 shadow-card p-7">
          <h1 className="font-display font-semibold text-lg text-ink mb-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-muted mb-6">
            {mode === "login" ? "Sign in to keep working on your boards." : "Start organizing your team's work."}
          </p>

          <form onSubmit={submit} className="space-y-3">
            {mode === "register" && (
              <input
                className="w-full px-3 py-2.5 rounded-lg border border-line bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <input
              type="email"
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            {error && <p className="text-sm text-signal-coral">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full text-center text-sm text-muted mt-5 hover:text-ink transition-colors"
          >
            {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
