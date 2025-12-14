import { getServerAuthSession } from "@/lib/auth";
import { generateCaptions } from "@/lib/gemini";
import { prisma } from "@/lib/db"; // ✅ ADDED
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  // 1️⃣ AUTH CHECK
  const session = await getServerAuthSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2️⃣ GET USER FROM SESSION
  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 401 }
    );
  }

  // 3️⃣ CHECK USER CREDITS (FREE PLAN)
  if (user.plan === "FREE" && user.credits <= 0) {
    return NextResponse.json(
      {
        error:
          "Your free credits are finished. Upgrade to PRO to continue",
      },
      { status: 403 }
    );
  }

  // 4️⃣ PARSE REQUEST BODY
  const { topic, details } = await req.json();

  // 5️⃣ VALIDATION
  if (!topic || !details) {
    return NextResponse.json(
      { error: "Fields are empty but required" },
      { status: 400 }
    );
  }

  try {
    // 6️⃣ GENERATE CAPTIONS
    const caption = await generateCaptions(topic, details);

    // 7️⃣ DEDUCT CREDIT (FREE USERS ONLY)
    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: 1, // ✅ SAFE & ATOMIC
          },
        },
      });
    }

    // 8️⃣ RETURN RESPONSE
    return NextResponse.json({ caption }, { status: 200 });

  } catch (error) {
    console.error("Caption Generation Error", error);
    return NextResponse.json(
      { error: "Failed to Generate Captions" },
      { status: 500 }
    );
  }
}
