import React from "react";
import Link from "next/link";
import { getServerAuthSession } from "@/lib/auth";
import RazorpayUpgradeButton from "@/components/RazorpayUpgradeButton/page";

export const metadata = {
  title: "Pricing - SaaS AI",
};

async function PricingPage() {
  const session = await getServerAuthSession();
  // console.log(session?.user?.role)
  const plan = session?.user?.plan || "FREE";
  // console.log(plan)
  const isLoggedIn = !!session;
  const isPro = plan === "PRO"; //if plan is pro isPro is true or else false

  return (
    <main className="min-h-screen px-6 py-12 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Simple pricing for your AI tools
          </h1>
          <p className="mt-2 text-slate-600">
            Start for free. Upgrade when you need unlimited power and priority
            support.
          </p>
        </header>

        {/* Cards */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* FREE */}
          <article className="rounded-xl border p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Free</h2>
                <p className="text-sm text-slate-500">₹0 / month</p>
              </div>
              <div className="text-sm px-2 py-1 rounded-md bg-slate-100 text-slate-700">
                Starter
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-slate-700">
              <li>Limited credits (see dashboard)</li>
              <li>Access to all AI tools</li>
              <li>No priority support</li>
            </ul>

            <div className="mt-6">
              {!isLoggedIn && (
                <Link
                  href="/api/auth/signin"
                  className="inline-block px-4 py-2 rounded-lg border bg-white hover:bg-slate-50"
                >
                  Login to start for free
                </Link>
              )}

              {isLoggedIn && !isPro && (
                <span className="inline-block px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800">
                  You are currently on the FREE plan.
                </span>
              )}

              {isLoggedIn && isPro && (
                <span className="inline-block px-4 py-2 rounded-lg bg-green-100 text-green-800">
                  Free features included with PRO
                </span>
              )}
            </div>
          </article>

          {/* PRO */}
          <article className="rounded-xl border p-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Pro</h2>
                <p className="text-sm">₹199 / month</p>
              </div>
              <div className="text-sm px-2 py-1 rounded-md bg-indigo-700/30">
                Most popular
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              <li>Unlimited credits</li>
              <li>All AI tools</li>
              <li>Priority support</li>
            </ul>

            <div className="mt-6">
              {!isLoggedIn && (
                <Link
                  href="/api/auth/signin"
                  className="inline-block px-4 py-2 rounded-lg bg-white text-indigo-700 font-medium"
                >
                  Login to upgrade
                </Link>
              )}

              {isLoggedIn && !isPro && (
                // Client component: will call /api/billing/checkout and open Razorpay
                <RazorpayUpgradeButton />
              )}

              {isLoggedIn && isPro && (
                <button
                  disabled
                  className="px-4 py-2 rounded-lg bg-indigo-800/50"
                >
                  You are already PRO ✅
                </button>
              )}
            </div>
          </article>
        </section>

        {/* Small FAQ */}
        <section className="mt-10 bg-white p-6 rounded-lg border">
          <h3 className="font-semibold">FAQ</h3>
          <div className="mt-3 text-slate-700">
            <p>
              <strong>What changes after upgrade?</strong> Credits become
              unlimited and you get priority support.
            </p>
            <p className="mt-2">
              <strong>How to cancel?</strong> Cancel in your account or contact
              support.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PricingPage;
