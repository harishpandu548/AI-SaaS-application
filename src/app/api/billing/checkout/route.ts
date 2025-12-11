import { getServerAuthSession } from "@/lib/auth";
import { razorpay } from "@/lib/razorpay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized ",
      },
      { status: 401 }
    );
  }

  try {
    //create subscription in razorpay
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PRO_PLAN_ID!,
      customer_notify: 1,
      total_count: 120,

      //we can pass meta through notes
      notes: {
        userId: session.user?.id,
        email: session?.user?.email || null,
      },
    });
    return NextResponse.json({
      subscriptionId: subscription.id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay Error", error);
    return NextResponse.json(
      {
        error: "Failed to create subscription",
      },
      { status: 500 }
    );
  }
}
