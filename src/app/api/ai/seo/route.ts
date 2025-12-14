import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateSeoAnalysis } from "@/lib/gemini";
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


  if (user.plan === "FREE" && user.credits <= 0) {
    return NextResponse.json(
      {
        error: "Free credits exhausted. Upgrade to PRO to continue.",
      },
      { status: 403 }
    );
  }

  const body = await req.json();
  const content = body.content as string | undefined;

  if (!content || content.trim().length === 0) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  try {
    const seoResult = await generateSeoAnalysis(content);

    // deduct credits only for FREE users
    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits - 1 },
      });
    }

    return NextResponse.json({ seoResult }, { status: 200 });
  } catch (error) {
    console.error("SEO Analyzer Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze SEO" },
      { status: 500 }
    );
  }
}
