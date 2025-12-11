// src/app/api/ai/pdf/route.ts
import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { summarizePdfText } from "@/lib/gemini";

export const runtime = "nodejs";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request) {
  try {
    // auth
    const session = await getServerAuthSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.plan === "FREE" && user.credits <= 0) {
      return NextResponse.json({ error: "No credits left. Upgrade to PRO." }, { status: 403 });
    }

    // parse incoming form
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const instructions = (form.get("instructions") as string) || undefined;

    if (!file) return NextResponse.json({ error: "PDF file is required" }, { status: 400 });
    if (file.type !== "application/pdf") return NextResponse.json({ error: "Only PDFs are supported" }, { status: 400 });

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) return NextResponse.json({ error: "PDF is too large (max 10MB)" }, { status: 400 });

    // convert to Buffer
    const arr = await file.arrayBuffer();
    const buffer = Buffer.from(arr);

    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      return NextResponse.json({ error: "invalid_pdf_buffer" }, { status: 400 });
    }
    const header = buffer.subarray(0, 4).toString("utf8");
    if (header !== "%PDF") {
      return NextResponse.json({ error: "uploaded_file_is_not_pdf" }, { status: 400 });
    }

    // dynamic import pdf-parse (buffer-only)
    const pdfParseMod: any = await import("pdf-parse").catch((e) => {
      console.error("Could not import pdf-parse:", e);
      throw new Error("internal_parser_missing");
    });
    const pdfParse = pdfParseMod.default || pdfParseMod;

    let parsed: any;
    try {
      parsed = await pdfParse(buffer);
    } catch (err: any) {
      console.error("pdf-parse failed:", err);
      return NextResponse.json({ error: "pdf_parse_failed", details: err?.message ?? String(err) }, { status: 500 });
    }

    const pdfText: string = parsed?.text ?? "";
    if (!pdfText || pdfText.trim().length === 0) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

    // summarize via your existing Gemini helper
    let summary: string;
    try {
      summary = await summarizePdfText(pdfText, instructions);
    } catch (err: any) {
      console.error("gemini_failed:", err);
      return NextResponse.json({ error: "gemini_failed", details: err?.message ?? String(err) }, { status: 500 });
    }

    // deduct free credit
    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: Math.max(0, user.credits - 1) },
      });
    }

    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error("/api/ai/pdf fatal:", err);
    return NextResponse.json({ error: "server_error", details: err?.message ?? String(err) }, { status: 500 });
  }
}
