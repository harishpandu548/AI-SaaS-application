"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/user-context";

function EmailWriterClient() {
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("professional");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const { refreshUser } = useUser();

  const resultRef = useRef<HTMLDivElement | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setEmail("");

    try {
      const res = await axios.post("/api/ai/email", {
        subject,
        tone,
        details,
      });
      setEmail(res.data.email);
      await refreshUser()
    } catch (error) {
      console.error("Error fetching Email data", error);
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

  // auto scroll
  useEffect(() => {
    if (email && resultRef.current) {
      const offset = 120;
      const top =
        resultRef.current.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: top - offset,
        behavior: "smooth",
      });
    }
  }, [email]);

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-12 overflow-hidden"
    >
      {/* bg main theme BACKGROUND */}
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
            AI Email Writer
          </h1>
          <p className="text-zinc-600 mt-3 max-w-xl mx-auto">
            Generate professional, friendly, or casual emails in seconds using AI.
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
        
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Email Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Follow-up on project discussion"
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

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Email Details
              </label>
              <textarea
                rows={5}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain what the email should include..."
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
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                </select>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading || !subject.trim()}
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
                {loading ? "Generating..." : "Generate Email"}
              </motion.button>
            </div>
          </form>
        </motion.section>

        <AnimatePresence>
          {email && (
            <motion.section
              ref={resultRef}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="
                mt-12 rounded-3xl p-8 space-y-6
                bg-white/85 backdrop-blur-xl

                border border-purple-500/30
                ring-1 ring-purple-500/20

                shadow-lg
                transition-all duration-300
                hover:border-transparent
                hover:ring-2 hover:ring-pink-500/50
                hover:shadow-[0_0_50px_rgba(168,85,247,0.30)]
              "
            >
              <div>
                <h2 className="text-2xl font-semibold text-zinc-900">
                  Generated Email
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  You can copy the email below and use it directly.
                </p>
              </div>

              <pre className="
                whitespace-pre-wrap
                bg-white/60 backdrop-blur
                border border-purple-500/20
                rounded-xl p-6
                text-zinc-800
                max-w-full overflow-x-auto
              ">
                {email}
              </pre>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigator.clipboard.writeText(email);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium
                  transition-all
                  ${
                    copied
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "border border-purple-500/30 hover:bg-purple-50"
                  }
                `}
              >
                {copied ? "Copied ✓" : "Copy to Clipboard"}
              </motion.button>
            </motion.section>
          )}
        </AnimatePresence>

   
        {!email && !loading && (
          <p className="mt-6 text-sm text-zinc-500 text-center">
            Tip: Add more details for better, more personalized emails.
          </p>
        )}
      </div>
    </motion.main>
  );
}

export default EmailWriterClient;
