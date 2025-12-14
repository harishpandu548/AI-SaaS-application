import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateGrammarFix } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // credit check
  if (user.plan === "FREE" && user.credits <= 0) {
    return NextResponse.json(
      { error: "Free credits exhausted. Upgrade to PRO." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const text = body.text as string | undefined;
  const tone = (body.tone as string | undefined) ?? "professional";

  if (!text || text.trim().length === 0) {
    return NextResponse.json(
      { error: "Text is required" },
      { status: 400 }
    );
  }

  try {
    const improvedText = await generateGrammarFix(text, tone);

    // deduct credit for FREE user
    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits - 1 },
      });
    }

    return NextResponse.json(
      { result: improvedText },
      { status: 200 }
    );
  } catch (error) {
    console.error("Grammar Tool Error:", error);
    return NextResponse.json(
      { error: "Failed to improve text" },
      { status: 500 }
    );
  }
}
