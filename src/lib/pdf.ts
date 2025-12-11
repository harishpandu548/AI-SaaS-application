try {
  // dynamic import so server builds will try to load the native module
  const canvasMod: any = await import("@napi-rs/canvas");
  // map common DOM-like classes if missing
  if (!(globalThis as any).ImageData && canvasMod.ImageData) {
    (globalThis as any).ImageData = canvasMod.ImageData;
  }
  if (!(globalThis as any).DOMMatrix && canvasMod.DOMMatrix) {
    (globalThis as any).DOMMatrix = canvasMod.DOMMatrix;
  }
  if (!(globalThis as any).Path2D && canvasMod.Path2D) {
    (globalThis as any).Path2D = canvasMod.Path2D;
  }
} catch (err) {
  console.warn("canvas polyfill (@napi-rs/canvas) failed to load:", err?.message ?? err);
}


import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import "pdfjs-dist/legacy/build/pdf.worker.mjs";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Convert buffer to Uint8Array (pdfjs required format)
  const pdfData = new Uint8Array(buffer);

  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;

  let finalText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    for (const item of textContent.items) {
      finalText += (item as any).str + " ";
    }
  }

  return finalText.trim();
}
