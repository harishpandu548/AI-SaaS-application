import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateInterviewQuestions } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.plan === "FREE" && user.credits <= 0) {
    return NextResponse.json(
      { error: "Free credits exhausted. Upgrade to PRO." },
      { status: 403 }
    );
  }

  const { role, level, type } = await req.json();

  if (!role || !level || !type) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const questions = await generateInterviewQuestions(role, level, type);

    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits - 1 },
      });
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
