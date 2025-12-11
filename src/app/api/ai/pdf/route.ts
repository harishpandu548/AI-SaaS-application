export const runtime = "nodejs";

import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { summarizePdfText } from "@/lib/gemini";
import { extractTextFromPdf } from "@/lib/pdf";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user?.id;

  // 1checking user credits by finding the user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.plan === "FREE" && user.credits <= 0) {
    return NextResponse.json(
      { error: "No credits left. Upgrade to PRO." },
      { status: 403 }
    );
  }

  try {
    // taking data from the frontend like file text
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const instructions = formData.get("instructions") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "PDF file is required" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; //10mb
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "PDF is too large (max 10MB)" },
        { status: 400 }
      );
    }

    // converting pdf file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // extracting text from that file 
    let pdfText: string;
    try {
      pdfText = await extractTextFromPdf(buffer);
      console.log("Extracted PDF text length:", pdfText.length);
    } catch (err) {
      console.error("pdf_parse_failed:", err);
      return NextResponse.json(
        {
          error: "pdf_parse_failed",
          details:
            err instanceof Error ? err.message : JSON.stringify(err),
        },
        { status: 500 }
      );
    }

    if (!pdfText || pdfText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from PDF" },
        { status: 400 }
      );
    }

    // from above we got the text now we are giving this text to gemini to get the summary
    let summary: string;
    try {
      summary = await summarizePdfText(pdfText, instructions || undefined);
    } catch (err) {
      console.error("gemini_failed:", err);
      return NextResponse.json(
        {
          error: "gemini_failed",
          details:
            err instanceof Error ? err.message : JSON.stringify(err),
        },
        { status: 500 }
      );
    }

    // if summary genrated deduct 1 point if user is free user
    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits - 1 },
      });
    }

    // returns the summary
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("PDF summarize error (outer catch):", error);
    return NextResponse.json(
      { error: "Failed to summarize PDF" },
      { status: 500 }
    );
  }
}
