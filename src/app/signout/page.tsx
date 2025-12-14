"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SignOutPage() {
  useEffect(() => {
    signOut({
      callbackUrl: "/",
    });
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100">
      <div className="
        relative
        px-10 py-12 rounded-3xl
        bg-white/70 backdrop-blur-xl
        border border-white/30
        shadow-[0_25px_60px_rgba(168,85,247,0.25)]
        text-center
      ">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Signing you out…
        </h1>

        <p className="mt-3 text-zinc-600">
          Please wait a moment
        </p>

        <div className="mt-6 h-1 w-48 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-600 animate-pulse" />
      </div>
    </main>
  );
}
