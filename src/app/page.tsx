"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import HomeSkeleton from "./HomeSkeleton";
import { useUser } from "@/context/user-context";
import { Diamond } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const { plan, credits } = useUser();

  if (status === "loading") {
    return <HomeSkeleton />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* 🌈 AURORA BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-pink-400/25 blur-3xl" />
        <div className="absolute top-1/4 -right-40 h-[600px] w-[600px] rounded-full bg-purple-400/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-6 pt-14 pb-28 grid gap-16 lg:grid-cols-2 items-start">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <span className="inline-flex items-center rounded-full bg-white/70 backdrop-blur px-4 py-1 text-sm font-medium border shadow-sm">
            ⚡ AI SaaS Platform
          </span>

          <h1 className="text-4xl md:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-zinc-900">
            Create smarter content with{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              AI automation
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-600 max-w-xl">
            Generate blogs, emails, captions, summaries and chat responses —
            powered by Gemini AI. Built for creators, founders and developers.
          </p>

          {/* FEATURE CHIPS */}
          <div className="flex flex-wrap gap-3 pt-4">
            {[
              "🧠 Gemini AI",
              "✍️ Blog Writer",
              "📧 Email Writer",
              "📄 PDF Summarizer",
              "💬 AI Chat",
              "💳 Credits System",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full bg-white/70 backdrop-blur px-4 py-1 text-sm border shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* RIGHT GLASS CARD */}
        <motion.aside
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          whileHover={{ y: -6 }}
          className="relative lg:mt-12"
        >
          {/* GLOW */}
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-70 blur-md" />

          {/* CARD */}
          <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl p-7">
            {session ? (
              <div className="space-y-6">
                {/* USER */}
                <div className="flex items-center gap-4">
                  <div
                    className="
                    h-14 w-14 rounded-full
                    bg-gradient-to-br from-pink-500 to-purple-600
                    ring-4 ring-purple-300/30
                    text-white flex items-center justify-center
                    text-xl font-bold
                  "
                  >
                    {session.user?.name?.[0] ?? "U"}
                  </div>

                  <div>
                    <p className="font-semibold text-zinc-900">
                      {session.user?.name}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {session.user?.email}
                    </p>
                  </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/70 p-4 text-center border">
                    <p className="text-xs text-zinc-500">Plan</p>
                    <p className="font-bold">{plan}</p>
                  </div>

                  <div className="rounded-xl bg-white/70 p-4 text-center border">
                    <p className="text-xs text-zinc-500">Credits</p>
                    {plan === "PRO" ? (
                      <div className="flex justify-center items-center gap-1 text-purple-700 font-bold">
                        💎 ∞
                      </div>
                    ) : (
                      <p className="font-bold">{credits ?? 20}</p>
                    )}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/dashboard"
                    className="
                      flex items-center justify-center
                      rounded-xl px-4 py-3 font-medium
                      text-white
                      bg-gradient-to-r from-pink-500 to-purple-600
                      shadow-lg
                      hover:shadow-[0_0_25px_rgba(168,85,247,0.45)]
                      transition
                    "
                  >
                    Open Dashboard
                  </Link>

                  <Link
                    href="/pricing"
                    className="
                      flex items-center justify-center
                      rounded-xl px-4 py-3 font-medium
                      bg-white/80 backdrop-blur
                      border border-purple-200
                      hover:bg-white
                      transition
                    "
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
            ) : (
              /* LOGGED OUT */
              <div className="space-y-6">
                <p className="text-lg font-semibold text-zinc-800">
                  Welcome back
                </p>

                <p className="text-sm text-zinc-500">
                  Sign in to access your AI workspace
                </p>

                <button
                  onClick={() =>
                    signIn("google", { callbackUrl: "/dashboard" })
                  }
                  className="
                    w-full flex items-center justify-center gap-3
                    rounded-xl px-4 py-3
                    font-medium
                    bg-white/90 backdrop-blur
                    border border-zinc-200
                    shadow-sm
                    hover:shadow-md
                    transition
                  "
                >
                  <Image
                    src="/google.png"
                    alt="Google"
                    width={50}
                    height={50}
                  />
                  Sign in with Google
                </button>

                <p className="text-xs text-zinc-400 text-center">
                  Secure authentication powered by Google
                </p>
              </div>
            )}
          </div>
        </motion.aside>
      </section>
    </main>
  );
}
