"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";

export default function YoutubeScriptClient() {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("5 minutes");
  const [tone, setTone] = useState("friendly");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const resultRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { refreshUser } = useUser();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const res = await axios.post("/api/ai/youtube", {
        topic,
        duration,
        tone,
      });

      setResult(res.data.script);
      await refreshUser();
      router.refresh();
    } catch (error) {
      alert("Failed to generate script");
    } finally {
      setLoading(false);
    }
  }

  // auto scrollig when content generated
  useEffect(() => {
    if (result && resultRef.current) {
      const offset = 120;
      const top =
        resultRef.current.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: top - offset,
        behavior: "smooth",
      });
    }
  }, [result]);

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-12 overflow-hidden"
    >
      {/*  bg main theme BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-pink-400/25 blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] bg-purple-400/25 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.10),transparent_60%)]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
    
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-extrabold text-zinc-900">
            AI YouTube Script Generator
          </h1>
          <p className="text-zinc-600 mt-3 max-w-xl mx-auto">
            Generate engaging, well-structured YouTube scripts with hooks,
            sections, and strong call-to-actions.
          </p>
        </motion.header>


        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
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
            {/* topic */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Video Topic
              </label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How to build an AI SaaS"
                className="
                  w-full rounded-xl
                  bg-white/40 backdrop-blur
                  border border-purple-500/30
                  ring-1 ring-purple-500/20
                  px-4 py-3
                  text-zinc-800 placeholder:text-zinc-400
                  transition-all
                  focus:outline-none
                  focus:border-transparent
                  focus:ring-2 focus:ring-pink-500/60
                "
              />
            </div>

         
            <div className="flex flex-wrap gap-6 items-end pt-4 border-t border-white/30">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="
                    rounded-xl
                    bg-white/40 backdrop-blur
                    border border-purple-500/30
                    ring-1 ring-purple-500/20
                    px-4 py-2
                    text-zinc-800
                    transition-all
                    focus:outline-none
                    focus:border-transparent
                    focus:ring-2 focus:ring-pink-500/60
                  "
                >
                  <option>3 minutes</option>
                  <option>5 minutes</option>
                  <option>10 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="
                    rounded-xl
                    bg-white/40 backdrop-blur
                    border border-purple-500/30
                    ring-1 ring-purple-500/20
                    px-4 py-2
                    text-zinc-800
                    transition-all
                    focus:outline-none
                    focus:border-transparent
                    focus:ring-2 focus:ring-pink-500/60
                  "
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                </select>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading || !topic.trim()}
                className="
                  ml-auto inline-flex items-center gap-2
                  px-6 py-3 rounded-xl font-medium
                  bg-gradient-to-r from-pink-500 to-purple-600
                  text-white
                  shadow-lg
                  transition-all
                  hover:shadow-[0_0_30px_rgba(168,85,247,0.45)]
                  disabled:opacity-60
                "
              >
                {loading ? "Generating..." : "Generate Script"}
              </motion.button>
            </div>
          </form>
        </motion.section>


        <AnimatePresence>
          {result && (
            <motion.section
              ref={resultRef}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="
                mt-12 relative rounded-3xl p-8 space-y-6
                bg-gradient-to-br from-pink-500/10 via-white/10 to-purple-500/10
                backdrop-blur-2xl
                border border-purple-500/30
                ring-1 ring-purple-500/20
                shadow-[0_20px_50px_rgba(168,85,247,0.18)]
                transition-all duration-300
                hover:border-transparent
                hover:ring-2 hover:ring-pink-500/50
                hover:shadow-[0_0_60px_rgba(168,85,247,0.35)]
              "
            >
              <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20 pointer-events-none" />

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-900">
                    Generated Script
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    Copy or download the script below.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      copied
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "border hover:bg-zinc-50"
                    }`}
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>

                  <button
                    onClick={() => {
                      const blob = new Blob([result], {
                        type: "text/markdown",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "youtube-script.md";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-sm transition"
                  >
                    Download .md
                  </button>
                </div>
              </div>

              <article
                className="
    prose prose-zinc
    max-w-3xl mx-auto
    prose-lg
    prose-p:leading-7
    text-zinc-800
  "
              >
                <ReactMarkdown>{result}</ReactMarkdown>
              </article>
            </motion.section>
          )}
        </AnimatePresence>

        {!result && !loading && (
          <p className="mt-6 text-sm text-zinc-500 text-center">
            Tip: Shorter durations work best for explainer videos.
          </p>
        )}
      </div>
    </motion.main>
  );
}
