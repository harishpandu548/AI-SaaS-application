import React from "react";
import Link from "next/link";
import { getServerAuthSession } from "@/lib/auth";
import RazorpayUpgradeButton from "@/components/RazorpayUpgradeButton/page";

export const metadata = {
  title: "Pricing - SaaS AI",
};

async function PricingPage() {
  const session = await getServerAuthSession();
  const plan = session?.user?.plan || "FREE";
  const isLoggedIn = !!session;
  const isPro = plan === "PRO";

  return (
    <main className="relative min-h-screen px-6 pt-8 pb-16 bg-[#fafafa] overflow-hidden">
      {/* our bg theme */}
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-pink-400/20 blur-3xl" />
      <div className="absolute top-20 -right-40 h-[520px] w-[520px] rounded-full bg-purple-400/20 blur-3xl" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">
            Simple, transparent pricing
          </h1>

          <p className="mt-2 text-base text-zinc-600 max-w-xl mx-auto">
            Start free. Upgrade when you need unlimited AI power.
          </p>
        </header>

        {/* pricing cards */}
        <section className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* FREE */}
          <article
            className="
            relative rounded-3xl border border-zinc-200
            bg-white/80 backdrop-blur p-6 shadow-sm
            transition-all duration-300
            hover:-translate-y-1
            hover:shadow-lg
            hover:ring-2 hover:ring-pink-500/40
          "
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">Free</h2>
                <p className="text-sm text-zinc-500 mt-0.5">₹0 / month</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
                Starter
              </span>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              <li>✔ Limited monthly credits</li>
              <li>✔ Access to all AI tools</li>
              <li>✖ No priority support</li>
            </ul>

            <div className="mt-6">
              {!isLoggedIn && (
                <Link
                  href="/signin"
                  className="inline-block w-full text-center px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 transition"
                >
                  Login to start free
                </Link>
              )}

              {isLoggedIn && !isPro && (
                <div className="rounded-xl bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
                  You’re on the FREE plan
                </div>
              )}

              {isLoggedIn && isPro && (
                <div className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-800">
                  Free features included with PRO
                </div>
              )}
            </div>
          </article>

          {/* PRO */}
          <article
            className="
            relative rounded-3xl p-6 bg-white shadow-2xl
            transition-all duration-300
            hover:-translate-y-1
            hover:scale-[1.01]
          "
          >
          
            <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-md opacity-50" />

            <div className="relative rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Pro</h2>
                  <p className="text-sm mt-0.5">₹1 / month</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur">
                  Most popular
                </span>
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                <li>✔ Unlimited credits</li>
                <li>✔ All AI tools unlocked</li>
                <li>✔ Priority support</li>
              </ul>

              <div className="mt-6">
                {!isLoggedIn && (
                  <Link
                    href="/signin"
                    className="inline-block w-full text-center px-4 py-2 rounded-xl bg-white text-purple-700 font-medium hover:bg-zinc-100 transition"
                  >
                    Login to upgrade
                  </Link>
                )}

                {isLoggedIn && !isPro && <RazorpayUpgradeButton />}

                {isLoggedIn && isPro && (
                  <button
                    disabled
                    className="w-full px-4 py-2 rounded-xl bg-white/30 text-white"
                  >
                    You’re already PRO 💎
                  </button>
                )}
              </div>
            </div>
          </article>
        </section>

      {/* test cards */}
        <section
          id="test-cards"
          className="mt-8 max-w-3xl mx-auto rounded-2xl bg-white/80 backdrop-blur border border-purple-200 p-5"
        >
          <span className="inline-block mb-2 px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
            No real money is charged this just demo or testing
          </span>

          <h3 className="text-base font-semibold text-zinc-900 mb-2">
            Test Card for Indian Payments
          </h3>

          <div className="flex justify-between text-sm">
            <span className="font-medium">Visa</span>
            <span className="font-mono">4386 2894 0766 0153</span>
          </div>

          <p className="text-xs text-zinc-500 mt-2">
            CVV: Any random • Expiry: Any future date
          </p>
        </section>
      </div>
    <div className="
  mt-4
  rounded-2xl
  bg-white/70 backdrop-blur
  border border-purple-200
  px-5 py-4
">
  <p className="text-sm text-zinc-700 leading-6">
    <strong>Important Note:</strong>{" "}
    This test card is provided to help recruiters and reviewers verify
    the payment workflow of this application.
  </p>

  <p className="mt-2 text-sm text-zinc-600 leading-6">
    During checkout, enter your own{" "}
    <strong>mobile number</strong> and{" "}
    <strong>email address</strong> to receive OTPs.
    When card details are requested, use the above{" "}
    <strong>Visa test card</strong>, enter{" "}
    <strong>any cardholder name</strong>,{" "}
    <strong>any future expiry date</strong>, and{" "}
    <strong>any CVV</strong>.
  </p>

  <p className="mt-2 text-sm text-zinc-600 leading-6">
    You will first receive an OTP for mobile verification.
    After submitting it, a second OTP will be requested for card verification.
    You may enter <strong>any numeric value</strong> and proceed.
  </p>

  <p className="mt-2 text-sm text-zinc-600 leading-6">
    Once the payment is successful, the account is automatically upgraded
    from <strong>FREE</strong> to <strong>PRO</strong> within{" "}
    <strong>2–5 seconds</strong>.
  </p>
</div>


    </main>
  );
}

export default PricingPage;
