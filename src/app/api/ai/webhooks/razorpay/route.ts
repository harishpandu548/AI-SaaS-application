import { prisma } from "@/lib/db";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing rzp weebhook secret" },
      { status: 500 }
    );
  }
  // raw body
  const body = await req.text();
  //   to get signature
  const razorpaySignature = req.headers.get("x-razorpay-signature");

  if (!razorpaySignature) {
    return NextResponse.json({ status: "no signature" }, { status: 400 });
  }
  //   verify the signature
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }
  //converting raw body
  const event = JSON.parse(body);
  try {
    const eventType = event.event as string;
    if (eventType === "subscription.activated") {
      const subscription = event.payload.subscription.entity;
      const notes = subscription.notes || {};
      const userId = notes.userId as string | undefined;
      if (!userId) {
        return NextResponse.json(
          { error: "No userId found in subscription notes" },
          { status: 401 }
        );
      }
      //update user in db
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: "PRO",
          credits: 500,
        },
      });

      console.log("User upgraded to PRO:", userId);
    }
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    );
  }
}
