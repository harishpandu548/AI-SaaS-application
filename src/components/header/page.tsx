"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@/context/user-context";

// skeleton loader

function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-white/30 bg-white/40 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between animate-pulse">
        <div className="h-5 w-20 rounded bg-zinc-200" />
        <div className="flex items-center gap-2">
          <div className="h-6 w-14 rounded-full bg-zinc-200" />
          <div className="h-6 w-14 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

// header

function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { plan, credits } = useUser();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  if (status === "loading") {
    return <HeaderSkeleton />;
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="
        sticky top-0 z-50 w-full
        bg-white/30 backdrop-blur-2xl
        border-b border-white/30
        shadow-[0_10px_40px_rgba(168,85,247,0.15)]
      "
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-32 w-[240px] sm:w-[300px] h-[240px] sm:h-[300px] bg-pink-400/20 blur-3xl rounded-full" />
        <div className="absolute -top-24 right-0 w-[240px] sm:w-[300px] h-[240px] sm:h-[300px] bg-purple-400/20 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Link
            href="/"
            className="
              font-extrabold text-base sm:text-lg tracking-tight
              bg-gradient-to-r from-pink-500 to-purple-600
              bg-clip-text text-transparent
            "
          >
            SaaS AI
          </Link>

          {session && (
            <div className="flex sm:hidden items-center gap-2">
              <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-white/40 border text-indigo-600">
                {plan}
              </span>
              <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-white/40 border text-purple-600">
                {plan === "PRO" ? "∞" : credits} 💎
              </span>
            </div>
          )}
        </div>

        <motion.nav
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.06 },
            },
          }}
          className="flex flex-wrap items-center gap-2 justify-center sm:justify-end"
        >
          <Link
            href="/pricing"
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all ${
              isActive("/pricing")
                ? "bg-gradient-to-r from-pink-500/25 to-purple-500/25 ring-1 ring-purple-400/40 text-purple-700 font-medium"
                : "text-zinc-700 hover:bg-white/40"
            }`}
          >
            Pricing
          </Link>

          {session && (
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all ${
                isActive("/dashboard")
                  ? "bg-gradient-to-r from-pink-500/25 to-purple-500/25 ring-1 ring-purple-400/40 text-purple-700 font-medium"
                  : "text-zinc-700 hover:bg-white/40"
              }`}
            >
              Dashboard
            </Link>
          )}

          {session && (
            <Link
              href="/dashboard/admin"
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm hover:shadow-md transition"
            >
              Admin
            </Link>
          )}

          {session && (
            <Link
              href="/signout"
              className="
                px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium
                bg-gradient-to-r from-red-500 to-rose-600
                text-white shadow-sm hover:shadow-md transition
              "
            >
              Sign out
            </Link>
          )}

          {!session && (
            <Link
              href="/signin"
              className="
                px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium
                text-white bg-gradient-to-r from-pink-500 to-purple-600
                shadow-md
              "
            >
              Sign in
            </Link>
          )}
        </motion.nav>
      </div>
    </motion.header>
  );
}

export default Header;
