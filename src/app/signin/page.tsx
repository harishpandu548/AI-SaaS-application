"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function SignInPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
      
      {/* 🌈 AURORA BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-pink-400/25 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-purple-400/25 blur-3xl" />
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          relative z-10
          w-full max-w-md
          rounded-3xl
          bg-white/80 backdrop-blur-xl
          border border-white/40
          shadow-[0_25px_60px_rgba(168,85,247,0.25)]
          px-8 py-10
          text-center
        "
      >
        {/* LOGO / TITLE */}
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Welcome back
        </h1>

        <p className="mt-2 text-zinc-600">
          Sign in to access your AI workspace
        </p>

        {/* SIGN IN BUTTON */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="
            mt-8 w-full
            flex items-center justify-center gap-3
            rounded-xl px-4 py-3
            font-medium
            bg-white/90 backdrop-blur
            border border-zinc-200
            shadow-sm
            hover:shadow-md
            transition
          "
        >
          {/* Inline Google SVG → no image loading issues */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.18 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.6 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.14-3.09-.4-4.55H24v9.02h12.94c-.56 3-2.23 5.53-4.75 7.24l7.73 6c4.51-4.17 7.06-10.31 7.06-17.71z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.18 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.6 48 24 48z"/>
          </svg>

          <span>Sign in with Google</span>
        </button>

        {/* FOOTER */}
        <p className="mt-6 text-xs text-zinc-400">
          Secure authentication powered by Google
        </p>
      </motion.div>
    </main>
  );
}
