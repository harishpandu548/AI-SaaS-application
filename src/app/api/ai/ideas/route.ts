import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateIdeas } from "@/lib/gemini";
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
      { error: "Free credits exhausted. Upgrade to PRO." },
      { status: 403 }
    );
  }

  const { topic, category } = await req.json();

  if (!topic || !category) {
    return NextResponse.json(
      { error: "Topic and category are required" },
      { status: 400 }
    );
  }

  try {
    const ideas = await generateIdeas(topic, category);

    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits - 1 },
      });
    }

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate ideas" },
      { status: 500 }
    );
  }
}
