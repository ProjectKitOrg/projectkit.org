"use client";

import { useState } from "react";

const FEATURES = [
  {
    icon: "⬡",
    title: "Complete project hosting",
    body: "3D models, schematics, source code, bills of materials — everything a builder needs to understand, replicate, or remix your work.",
  },
  {
    icon: "⚡",
    title: "One-click part sourcing",
    body: "Automatically route PCB orders to JLCPCB or PCBWay, sheet metal to SendCutSend, and more — straight from your project's BOM.",
  },
  {
    icon: "◈",
    title: "Any scale",
    body: "From a weekend breadboard hack to a production-ready hardware product. ProjectKit organizes it all the same way.",
  },
  {
    icon: "◎",
    title: "Open source & community-driven",
    body: "The platform itself is open source. Self-host it, contribute to it, or just use it — your projects and your data stay yours.",
  },
];

type FormState = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [email, setEmail] = useState("");
  const [contributor, setContributor] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contributor }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setFormState("success");
    } catch (err) {
      setFormState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f0f0f0] flex flex-col">
      {/* Nav */}
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <span className="text-lg font-semibold tracking-tight text-white">
          projectkit<span className="text-cyan-400">.org</span>
        </span>
        <a
          href="https://github.com/projectkit-org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          GitHub →
        </a>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="flex flex-col items-center text-center px-6 pt-24 pb-20 max-w-4xl mx-auto w-full">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-1.5 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Early access — join the waitlist
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight text-white mb-6">
            Build anything.
            <br />
            <span className="text-cyan-400">Share everything.</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed">
            ProjectKit is the open-source platform for makers to publish complete
            projects — 3D models, source code, schematics, and bills of materials
            — with built-in tools to source and fulfill build kits through
            PCBWay, JLCPCB, SendCutSend, and more.
          </p>
        </section>

        {/* Features */}
        <section className="px-6 pb-24 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6"
              >
                <div className="text-2xl text-cyan-400 mb-3 font-mono">
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Signup */}
        <section className="px-6 pb-28 max-w-xl mx-auto w-full">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 sm:p-10">
            {formState === "success" ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-4">✓</div>
                <h2 className="text-white text-xl font-semibold mb-2">
                  You&apos;re on the list.
                </h2>
                <p className="text-zinc-400 text-sm">
                  We&apos;ll reach out when ProjectKit is ready to launch.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-white text-2xl font-bold mb-2">
                  Stay in the loop
                </h2>
                <p className="text-zinc-400 text-sm mb-6">
                  Be the first to know when we launch. No spam, ever.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={formState === "loading"}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 transition-colors"
                  />

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={contributor}
                      onChange={(e) => setContributor(e.target.checked)}
                      disabled={formState === "loading"}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-cyan-500 accent-cyan-500 disabled:opacity-50"
                    />
                    <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors leading-relaxed">
                      I&apos;m interested in contributing to the development of
                      ProjectKit
                    </span>
                  </label>

                  {formState === "error" && (
                    <p className="text-sm text-red-400">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={formState === "loading"}
                    className="w-full rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-black hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {formState === "loading" ? "Joining…" : "Join the waitlist"}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-xs text-zinc-600">
        <p>
          ProjectKit is open source and community-driven. •{" "}
          <a
            href="https://github.com/projectkit-org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400 transition-colors"
          >
            Contribute on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
