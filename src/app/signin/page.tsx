"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function SignInPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
      
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-pink-400/25 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-purple-400/25 blur-3xl" />
      </div>

      {/* card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40  shadow-[0_25px_60px_rgba(168,85,247,0.25)] px-8 py-10 text-center"
      >
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Welcome back
        </h1>

        <p className="mt-2 text-zinc-600">
          Sign in to access your AI workspace
        </p>

        {/* google */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="mt-8 w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3 font-medium bg-white/90 border border-zinc-200 shadow-sm hover:shadow-md transition"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.18 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.6 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.14-3.09-.4-4.55H24v9.02h12.94c-.56 3-2.23 5.53-4.75 7.24l7.73 6c4.51-4.17 7.06-10.31 7.06-17.71z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.18 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.6 48 24 48z"/>
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* github */}
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="mt-4 w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3 font-medium bg-black text-white shadow hover:bg-black/90 transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 .5C5.73.5.5 5.74.5 12.03c0 5.11 3.29 9.44 7.86 10.97.58.11.79-.25.79-.56v-2.02c-3.2.7-3.88-1.37-3.88-1.37-.53-1.35-1.29-1.71-1.29-1.71-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.99 0 1.99.13 2.9.39 2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.08.78 2.18v3.23c0 .31.21.68.8.56A11.53 11.53 0 0 0 23.5 12.03C23.5 5.74 18.27.5 12 .5z"/>
          </svg>
          <span>Sign in with GitHub</span>
        </button>

        {/* facebook */}
        <button
          onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
          className="mt-4 w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3 font-medium bg-[#1877F2] text-white shadow hover:bg-[#166FE5] transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24H12.8v-9.29H9.69V11h3.11V8.41c0-3.07 1.87-4.74 4.6-4.74 1.31 0 2.44.1 2.77.14v3.21h-1.9c-1.49 0-1.78.71-1.78 1.75V11h3.56l-.46 3.71h-3.1V24h6.08c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0z"/>
          </svg>
          <span>Sign in with Facebook</span>
        </button>

        <p className="mt-6 text-xs text-zinc-400">
          Secure authentication powered by OAuth
        </p>
      </motion.div>
    </main>
  );
}
