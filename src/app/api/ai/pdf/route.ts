// src/app/api/ai/pdf/route.ts
import { NextResponse } from "next/server";

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
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "PDF file is required" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      return NextResponse.json({ error: "invalid_pdf_buffer" }, { status: 400 });
    }

    const header = buffer.subarray(0, 4).toString("utf8");
    if (header !== "%PDF") {
      console.error("Uploaded file missing %PDF header", { header });
      return NextResponse.json({ error: "uploaded_file_is_not_pdf" }, { status: 400 });
    }

    // dynamic import of pdf-parse (buffer-only)
    const pdfParseMod: any = await import("pdf-parse").catch((e) => {
      console.error("Could not import pdf-parse:", e);
      throw new Error("internal_parser_missing");
    });
    const pdfParse = pdfParseMod.default || pdfParseMod;

    const parsed = await pdfParse(buffer);
    if (!parsed || typeof parsed.text !== "string") {
      console.error("pdf-parse returned unexpected result", { parsed });
      return NextResponse.json({ error: "pdf_parse_invalid_result" }, { status: 500 });
    }

    return NextResponse.json({ text: parsed.text });
  } catch (err: any) {
    console.error("/api/ai/pdf fatal:", err);
    return NextResponse.json({ error: "server_error", details: err?.message ?? String(err) }, { status: 500 });
  }
}
