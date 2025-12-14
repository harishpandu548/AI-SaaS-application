import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateMeetingNotes } from "@/lib/gemini";
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
      { error: "Free credits finished. Upgrade to PRO." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const notes = body.notes as string | undefined;

  if (!notes || notes.trim().length === 0) {
    return NextResponse.json(
      { error: "Meeting notes are required" },
      { status: 400 }
    );
  }

  try {
    const result = await generateMeetingNotes(notes);

    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits - 1 },
      });
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("Meeting Notes Error:", error);
    return NextResponse.json(
      { error: "Failed to generate meeting notes" },
      { status: 500 }
    );
  }
}
