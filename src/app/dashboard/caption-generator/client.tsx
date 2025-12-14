"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/user-context";

function ContentGeneratorClient() {
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const {refreshUser}=useUser()

  const resultRef = useRef<HTMLDivElement | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setContent("");

    try {
      const res = await axios.post("/api/ai/content", {
        topic,
        details,
      });
      setContent(res.data.caption);
      await refreshUser()
      setTopic("");
      setDetails("");
    } catch (error) {
      console.error(error);
      alert(
  "Gemini API daily limit reached.\n\n" +
  "This project uses the Gemini free tier, which allows up to 20 AI responses per day.\n\n" +
  "Today's limit has been exhausted. Please try again tomorrow.\n\n" +
  "Note: Higher limits require a paid Gemini plan. This project demonstrates full AI SaaS functionality for evaluation purposes."
);

    } finally {
      setLoading(false);
    }
  }

  // auto scrollig when content generated
  useEffect(() => {
    if (content && resultRef.current) {
      const offset = 120;
      const top =
        resultRef.current.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({ top: top - offset, behavior: "smooth" });
    }
  }, [content]);

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

      <div className="relative max-w-3xl mx-auto">

      
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-extrabold text-zinc-900">
            AI Caption Generator
          </h1>
          <p className="text-zinc-600 mt-3 max-w-xl mx-auto">
            Generate high-engagement captions for Instagram, LinkedIn,
            Twitter and more.
          </p>
        </motion.header>

     
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
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

    
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Topic / Product
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. New AI SaaS launch"
                className="
                  w-full rounded-xl
                  bg-white/40 backdrop-blur
                  border border-purple-500/30
                  ring-1 ring-purple-500/20
                  px-4 py-3 text-zinc-800 placeholder:text-zinc-400
                  transition-all
                  focus:outline-none
                  focus:border-transparent
                  focus:ring-2 focus:ring-pink-500/60
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Platform / Style
              </label>
              <input
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Instagram, short & catchy, hashtags included"
                className="
                  w-full rounded-xl
                  bg-white/40 backdrop-blur
                  border border-purple-500/30
                  ring-1 ring-purple-500/20
                  px-4 py-3 text-zinc-800 placeholder:text-zinc-400
                  transition-all
                  focus:outline-none
                  focus:border-transparent
                  focus:ring-2 focus:ring-pink-500/60
                "
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading || !topic.trim()}
              className="
                w-full py-3 rounded-xl font-medium
                bg-gradient-to-r from-pink-500 to-purple-600
                text-white shadow-lg
                transition-all
                hover:shadow-[0_0_30px_rgba(168,85,247,0.45)]
                disabled:opacity-60
              "
            >
              {loading ? "Generating..." : "Generate Captions"}
            </motion.button>
          </form>
        </motion.section>

        <AnimatePresence>
          {content && (
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
                  Generated Captions
                </h2>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(content);
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
                whitespace-pre-wrap
                bg-white/50 backdrop-blur
                border border-purple-500/20
                rounded-xl p-6 text-zinc-800
              ">
                {content}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

    
        {!content && !loading && (
          <p className="mt-6 text-sm text-zinc-500 text-center">
            Tip: Mention platform + tone for best results.
          </p>
        )}
      </div>
    </motion.main>
  );
}

export default ContentGeneratorClient;
