import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateYoutubeScript } from "@/lib/gemini";
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

  const body = await req.json();
  const topic = body.topic as string | undefined;
  const duration = body.duration as string | undefined;
  const tone = body.tone ?? "friendly";

  if (!topic || !duration) {
    return NextResponse.json(
      { error: "Topic and duration are required" },
      { status: 400 }
    );
  }

  try {
    const script = await generateYoutubeScript(topic, duration, tone);

    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits - 1 },
      });
    }

    return NextResponse.json({ script }, { status: 200 });
  } catch (error) {
    console.error("YouTube Script Error:", error);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}
