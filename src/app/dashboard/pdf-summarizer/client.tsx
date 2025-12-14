"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/user-context";

export default function PdfSummarizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { refreshUser } = useUser();

  const resultRef = useRef<HTMLDivElement | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSummary("");

    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (instructions.trim()) {
        formData.append("instructions", instructions);
      }

      const res = await fetch("/api/ai/pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setError("Something went wrong while processing the PDF.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setSummary(data.summary);
      await refreshUser()
    } catch {
      setError("Failed to summarize PDF.");
    } finally {
      setLoading(false);
    }
  }

  // 🔥 AUTO SCROLL TO SUMMARY
  useEffect(() => {
    if (summary && resultRef.current) {
      const offset = 120;
      const top =
        resultRef.current.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({ top: top - offset, behavior: "smooth" });
    }
  }, [summary]);

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-12 overflow-hidden"
    >
      {/* 🌈 AURORA BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-pink-400/25 blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] bg-purple-400/25 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.10),transparent_60%)]" />
      </div>

      <div className="relative max-w-3xl mx-auto">

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-extrabold text-zinc-900">
            AI PDF Summarizer
          </h1>
          <p className="text-zinc-600 mt-3 max-w-xl mx-auto">
            Upload a PDF and get a clean, concise summary powered by AI.
          </p>
        </motion.header>

        {/* 🌊 GLASS FORM */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="
            relative rounded-3xl p-8

            bg-gradient-to-br from-pink-500/10 via-white/10 to-purple-500/10
            backdrop-blur-2xl

            border border-pink-500/30
            ring-1 ring-purple-500/20

            shadow-[0_20px_50px_rgba(168,85,247,0.18)]

            transition-all duration-300
            hover:border-transparent
            hover:ring-2 hover:ring-pink-500/50
            hover:shadow-[0_0_60px_rgba(168,85,247,0.35)]
          "
        >
          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20 pointer-events-none" />

          <form onSubmit={handleSubmit} className="relative space-y-6">

            {/* FILE */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Upload PDF
              </label>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="
                  w-full text-sm
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border
                  file:border-purple-500/30
                  file:bg-white/40
                  file:text-zinc-700
                  file:backdrop-blur
                  hover:file:bg-purple-50
                "
              />

              {file && (
                <p className="text-xs text-zinc-500 mt-2">
                  Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
              )}
            </div>

            {/* INSTRUCTIONS */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Extra Instructions (optional)
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Focus on main points, ignore references..."
                className="
                  w-full rounded-xl h-28
                  bg-white/40 backdrop-blur
                  border border-purple-500/30
                  ring-1 ring-purple-500/20
                  px-4 py-3 text-zinc-800

                  transition-all
                  focus:outline-none
                  focus:border-transparent
                  focus:ring-2 focus:ring-pink-500/60
                "
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading || !file}
              className="
                w-full py-3 rounded-xl font-medium
                bg-gradient-to-r from-pink-500 to-purple-600
                text-white shadow-lg
                transition-all
                hover:shadow-[0_0_30px_rgba(168,85,247,0.45)]
                disabled:opacity-60
              "
            >
              {loading ? "Summarizing..." : "Summarize PDF"}
            </button>
          </form>
        </motion.section>

        {/* SUMMARY */}
        <AnimatePresence>
          {summary && (
            <motion.section
              ref={resultRef}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="
                mt-12 relative rounded-3xl p-8 space-y-4
                bg-gradient-to-br from-pink-500/10 via-white/10 to-purple-500/10
                backdrop-blur-2xl

                border border-purple-500/30
                ring-1 ring-purple-500/20
                shadow-[0_20px_50px_rgba(168,85,247,0.18)]
              "
            >
              <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20 pointer-events-none" />

              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-zinc-900">
                  Summary
                </h2>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(summary);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition
                    ${
                      copied
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "border border-purple-500/30 hover:bg-purple-50"
                    }
                  `}
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>

              <div className="
                whitespace-pre-wrap leading-relaxed
                bg-white/50 backdrop-blur
                border border-purple-500/20
                rounded-xl p-6 text-zinc-800
              ">
                {summary}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}
