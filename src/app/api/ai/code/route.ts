import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateCodeExplanation } from "@/lib/gemini";
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
  const code = body.code as string | undefined;
  const language = body.language ?? "JavaScript";

  if (!code || !code.trim()) {
    return NextResponse.json(
      { error: "Code is required" },
      { status: 400 }
    );
  }

  try {
    const explanation = await generateCodeExplanation(code, language);

    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits - 1 },
      });
    }

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Code explainer error:", error);
    return NextResponse.json(
      { error: "Failed to explain code" },
      { status: 500 }
    );
  }
}
