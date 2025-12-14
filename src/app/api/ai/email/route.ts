import { getServerAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized User" },
      { status: 401 }
    );
  }

  // get user from session
  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  // checking user credits
  if (user.plan === "FREE" && user.credits <= 0) {
    return NextResponse.json(
      {
        error:
          "Your free credits are finished. Upgrade to pro plan to continue",
      },
      { status: 403 }
    );
  }

  const { subject, details, tone } = await req.json();

  if (!subject || !details) {
    return NextResponse.json(
      { error: "Missing Fields" },
      { status: 400 }
    );
  }

  const prompt = `write a ${tone} email.
Subject: ${subject}.
Details to include: ${details}
Make it clean, professional, and easy to read`;

  try {
    const result = await model.generateContent(prompt);
    const email = result.response.text();

    // deduct one credit for FREE users
    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits - 1 },
      });
    }

    return NextResponse.json({ email }, { status: 200 });
  } catch (error) {
    console.error("Error writing Email", error);
    return NextResponse.json(
      { error: "AI error" },
      { status: 500 }
    );
  }
}
