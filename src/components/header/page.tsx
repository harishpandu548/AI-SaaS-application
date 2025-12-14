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
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between animate-pulse">
        <div className="h-5 w-24 rounded bg-zinc-200" />
        <div className="flex items-center gap-3">
          <div className="h-6 w-16 rounded-full bg-zinc-200" />
          <div className="h-6 w-16 rounded-full bg-zinc-200" />
          <div className="h-7 w-20 rounded-xl bg-zinc-200" />
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
      {/* theme */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-32 w-[300px] h-[300px] bg-pink-400/20 blur-3xl rounded-full" />
        <div className="absolute -top-24 right-0 w-[300px] h-[300px] bg-purple-400/20 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/"
            className="
              font-extrabold text-lg tracking-tight
              bg-gradient-to-r from-pink-500 to-purple-600
              bg-clip-text text-transparent
            "
          >
            SaaS AI
          </Link>
        </motion.div>

        {/* navbar */}
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="flex items-center gap-3"
        >
         {/* pricing */}
          <motion.div
            variants={{
              hidden: { y: -6, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            <Link
              href="/pricing"
              className={`px-3 py-1.5 rounded-xl text-sm transition-all ${
                isActive("/pricing")
                  ? "bg-gradient-to-r from-pink-500/25 to-purple-500/25 ring-1 ring-purple-400/40 text-purple-700 font-medium"
                  : "text-zinc-700 hover:bg-white/40"
              }`}
            >
              Pricing
            </Link>
          </motion.div>

          {/* dashboard showing only for logged in users */}
          {session && (
            <motion.div
              variants={{
                hidden: { y: -6, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 rounded-xl text-sm transition-all ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-pink-500/25 to-purple-500/25 ring-1 ring-purple-400/40 text-purple-700 font-medium"
                    : "text-zinc-700 hover:bg-white/40"
                }`}
              >
                Dashboard
              </Link>
            </motion.div>
          )}

          
          {session && (
            <motion.div
              variants={{
                hidden: { y: -6, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              className="flex items-center gap-2 ml-2"
            >
              {/* plan */}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/40 border text-indigo-600">
                {plan}
              </span>

              {/* credits */}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/40 border text-purple-600">
                {plan === "PRO" ? "∞" : credits} 💎
              </span>

            {/* admin button showing only when logged in */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                  className="ml-2"   

              >
                <Link
                  href="/dashboard/admin"
                  className="px-3 py-1.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm hover:shadow-md transition"
                >
                  Admin
                </Link>
              </motion.div>

              {/* sign out */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/signout"
                  className="
                    ml-2 px-3 py-1.5 rounded-xl text-sm font-medium
                    bg-gradient-to-r from-red-500 to-rose-600
                    text-white shadow-sm
                    hover:shadow-md
                    transition
                  "
                >
                  Sign out
                </Link>
              </motion.div>
            </motion.div>
          )}

          {/* sign for showed for new user or users want to login */}
          {!session && (
            <motion.div
              variants={{
                hidden: { y: -6, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <Link
                href="/signin"
                className="
                  ml-2 px-4 py-1.5 rounded-xl text-sm font-medium
                  text-white
                  bg-gradient-to-r from-pink-500 to-purple-600
                  shadow-md
                "
              >
                Sign in
              </Link>
            </motion.div>
          )}
        </motion.nav>
      </div>
    </motion.header>
  );
}

export default Header;
