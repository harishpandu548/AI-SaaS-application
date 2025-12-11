import React, { use } from "react";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import RazorpayUpgradeButton from "@/components/RazorpayUpgradeButton/page";

async function DashboardPage() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });

  const tools = [
    {
      title: "AI Blog Writer",
      description: "Generate long-form SEO optimized blogs",
      href: "/dashboard/blog-writer",
    },
    {
      title: "AI Email Writer",
      description: "Write professional Emails instantly",
      href: "/dashboard/email-writer",
    },
    {
      title: "Caption Generator",
      description: "Want to generate unique captions, Get started...",
      href: "/dashboard/caption-generator",
    },
    {
      title: "PDF Summarizer",
      description: "Upload a PDF and get a clean summary.",
      href: "/dashboard/pdf-summarizer",
    },
  ];

  return (
    <main className="min-h-screen px-6 py-10 bg-gray-50">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {session.user?.name?.split(" ")[0]} 👋
        </p>

        {/* PLAN BADGE */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="px-4 py-2 rounded-lg bg-white border shadow-sm">
            <span className="text-gray-500 text-sm">Plan</span>{" "}
            <span className="ml-2 px-3 py-1 rounded-md bg-indigo-100 text-indigo-700 text-sm font-semibold">
              {user?.plan}
            </span>
          </div>

          <div className="px-4 py-2 rounded-lg bg-white border shadow-sm">
            <span className="text-gray-500 text-sm">Credits Left</span>{" "}
            <span className="ml-2 px-3 py-1 rounded-md bg-green-100 text-green-700 text-sm font-semibold">
              {user?.credits} / 20
            </span>
          </div>

          {user?.plan === "FREE" && (
            <div>
              <RazorpayUpgradeButton />
            </div>
          )}
        </div>

        {/* TOOLS GRID */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Your AI Tools</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group border bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition duration-200"
              >
                <h3 className="text-xl font-semibold group-hover:text-indigo-600 transition">
                  {tool.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">{tool.description}</p>

                <div className="mt-4 text-indigo-600 font-medium flex items-center gap-1">
                  Open →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* AI CHAT SECTION */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-3">AI Chat Assistant</h2>
          <Link
            href="/dashboard/chat"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:underline"
          >
            Start Chatting →
          </Link>
        </section>

        {/* ADMIN PANEL */}
        {user?.role === "ADMIN" && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">Admin Controls</h2>
            <Link
              href="/dashboard/admin"
              className="text-sm text-red-600 underline"
            >
              Go to Admin Panel
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
export default DashboardPage;
