"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useState } from "react";

function DashboardClient() {
  const { name, plan, credits, role, refreshUser } = useUser();
  // console.log(name, plan, credits, role);
  const [syncing, setSyncing] = useState(true);
  useEffect(() => {
    let attempts = 0;

    const interval = setInterval(async () => {
      await refreshUser();
      attempts++;

      if (plan === "PRO" || attempts > 5) {
        clearInterval(interval);
        setSyncing(false);
      }
    }, 2000); // check every 2sec

    return () => clearInterval(interval);
  }, []);

const tools = [
  {
    title: "AI Blog Writer",
    description: "SEO-optimized long-form articles",
    href: "/dashboard/blog-writer",
    icon: "✍️",
  },
  {
    title: "AI Email Writer",
    description: "Professional emails in seconds",
    href: "/dashboard/email-writer",
    icon: "📧",
  },
  {
    title: "PDF Summarizer",
    description: "Summarize long PDFs instantly",
    href: "/dashboard/pdf-summarizer",
    icon: "📄",
  },
  {
    title: "AI Code Explainer",
    description:
      "Paste any code snippet and get a clear, step-by-step explanation in simple language.",
    href: "/dashboard/code",
    icon: "💻",
  },
  {
    title: "Caption Generator",
    description: "High-engagement social captions",
    href: "/dashboard/caption-generator",
    icon: "📢",
  },
  {
    title: "AI SEO Optimizer",
    description: "Optimize content for better SEO performance",
    href: "/dashboard/seo",
    icon: "📈",
  },
  {
    title: "AI YouTube Script Generator",
    description:
      "Generate engaging YouTube scripts with hooks, sections and CTA.",
    href: "/dashboard/youtube",
    icon: "🎬",
  },
  {
    title: "AI Grammar & Tone Improver",
    description: "Improve grammar, clarity, and tone instantly using AI.",
    href: "/dashboard/grammer",
    icon: "📝",
  },
  {
    title: "AI Interview Question Generator",
    description:
      "Generate role-based interview questions for technical and HR rounds.",
    href: "/dashboard/interview",
    icon: "🎯",
  },
  {
    title: "AI Ideas Generator",
    description: "Turn ideas into opportunities with AI.",
    href: "/dashboard/ideas",
    icon: "💡",
  },
  {
    title: "AI Meeting Notes Generator",
    description:
      "Turn meeting transcripts into summaries, action items and decisions.",
    href: "/dashboard/meeting-notes",
    icon: "🧠",
  },
];


  return (
    <main className="relative min-h-screen px-6 pt-6 pb-16 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
{/* theme */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-pink-400/25 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-purple-400/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.10),transparent_60%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-12 animate-fade-in">
      
        <section className="relative flex items-center justify-between">
     
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-400">
              Welcome back
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              {name?.split(" ")[0]}
            </h1>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900">
              Dashboard
            </h1>
          </div>

          <div className="flex gap-3">
            <Stat label="Plan" value={plan} />
            <Stat
              label="Credits"
              value={plan === "PRO" ? "∞ 💎" : `${credits} 💎`}
            />
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group relative rounded-3xl p-6 bg-gradient-to-br from-pink-500/10 via-white/10 to-purple-500/10 backdrop-blur-2xl border border-purple-500/30 ring-1 ring-purple-500/20 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-transparent hover:ring-2 hover:ring-pink-500/50 hover:shadow-[0_0_45px_rgba(168,85,247,0.35)]"
              >
                <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20 pointer-events-none" />

                <div className="relative">
                  <div className="text-3xl transition group-hover:scale-110">
                    {tool.icon}
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-zinc-900 group-hover:text-purple-700 transition">
                    {tool.title}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-600">
                    {tool.description}
                  </p>

                  <div className="mt-6 text-sm font-medium text-purple-600">
                    Open →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
{/* admin */}
        <section className="rounded-2xl p-5 bg-red-50 border border-red-300">
          <p className="text-sm text-red-700 mb-3">Admin access enabled</p>
          <Link
            href="/dashboard/admin"
            className="inline-block px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
          >
            Go to Admin Panel
          </Link>
        </section>
      </div>

<Link
  href="/dashboard/chat"
  className="
    fixed bottom-6 right-6 z-50
    flex flex-col items-center gap-2
    group
  "
>

  <div
    className="
      w-20 h-20
      rounded-full

      bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600
      flex items-center justify-center

      text-white text-4xl leading-none

      shadow-[0_0_35px_rgba(168,85,247,0.55)]
      transition-all duration-300 ease-out

      group-hover:scale-110
      group-hover:shadow-[0_0_70px_rgba(168,85,247,0.95)]
      group-hover:rotate-3
    "
  >
    🤖
  </div>


  <span
    className="
      text-xs font-medium
      text-zinc-700
      bg-white/70 backdrop-blur
      px-3 py-1 rounded-full
      border border-purple-300/40

      opacity-90
      transition-all duration-300
      group-hover:opacity-100
      group-hover:text-purple-700
      group-hover:shadow-[0_0_15px_rgba(168,85,247,0.35)]
    "
  >
    AI Assistant
  </span>
</Link>


    </main>
  );
}

export default DashboardClient;

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl px-4 py-2 text-xs bg-white/40 backdrop-blur-xl border border-purple-500/30 shadow-sm">
      <span className="text-zinc-500">{label}</span>
      <div className="font-semibold text-zinc-900">{value}</div>
    </div>
  );
}
