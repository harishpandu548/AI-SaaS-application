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
    // dynamic, protected polyfill + import
    try {
      const canvasMod: any = await import("@napi-rs/canvas").catch(() => null);
      if (canvasMod) {
        (globalThis as any).ImageData = (globalThis as any).ImageData || canvasMod.ImageData;
        (globalThis as any).DOMMatrix = (globalThis as any).DOMMatrix || canvasMod.DOMMatrix;
        (globalThis as any).Path2D = (globalThis as any).Path2D || canvasMod.Path2D;
      }
    } catch (polyErr) {
      console.warn("canvas polyfill load failed:", polyErr);
      // continue — we will catch pdfjs initialization errors below
    }

    const pdfjsLib: any = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // parse form and file
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "PDF file is required" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    // Actually extract text using pdfjs (safe if polyfill present)
    const pdfData = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    let finalText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      for (const item of textContent.items) finalText += (item as any).str + " ";
    }

    return NextResponse.json({ text: finalText.trim() });
  } catch (err: any) {
    console.error("/api/ai/pdf fatal:", err);
    // if pdfjs threw DOMMatrix error, this will show in logs — helpful for debugging
    return NextResponse.json({ error: "server_error", details: err?.message ?? String(err) }, { status: 500 });
  }
}
