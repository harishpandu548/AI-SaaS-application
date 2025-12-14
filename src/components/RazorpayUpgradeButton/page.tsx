"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

function RazorpayUpgradeButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useUser();

  async function handleUpgrade() {
    try {
      setLoading(true);

      const res = await axios.post("/api/billing/checkout");
      const data = res.data;

      if (!data.subscriptionId) {
        alert("Error starting subscription");
        setLoading(false);
        return;
      }

      const options = {
        key: data.key,
        subscription_id: data.subscriptionId,
        name: "AI SAAS Platform",
        description: "PRO Users",

        // runs only after successful payment
        handler: async function (response: any) {
          console.log("Payment success", response);
          alert("Payment successful!");
          // ensure db + session + context are fresh
          // await refreshUser();     // updates plan + credits in context
          router.push("/dashboard");
          // router.refresh();        // refreshes server components
        },

        theme: { color: "#6366f1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      disabled={loading}
      onClick={handleUpgrade}
      className="
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-xl font-semibold
        bg-gradient-to-r from-pink-500 to-purple-600
        text-white
        shadow-lg
        transition-all duration-300
        hover:shadow-[0_0_25px_rgba(168,85,247,0.45)]
        hover:-translate-y-0.5
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {loading ? "Opening Razorpay..." : "Upgrade to Pro"}
    </button>
  );
}

export default RazorpayUpgradeButton;
