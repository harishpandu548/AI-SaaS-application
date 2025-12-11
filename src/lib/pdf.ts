// src/lib/pdf.ts
// Buffer-only wrapper for pdf-parse to avoid any file-path handling by the library.

export async function extractTextFromPdf(input: Buffer | ArrayBuffer | Uint8Array): Promise<string> {
  // Convert to Buffer if needed
  let buffer: Buffer;
  if (Buffer.isBuffer(input)) {
    buffer = input;
  } else if (input instanceof ArrayBuffer) {
    buffer = Buffer.from(input);
  } else if (input instanceof Uint8Array) {
    buffer = Buffer.from(input.buffer);
  } else {
    throw new Error("extractTextFromPdf: input must be Buffer | ArrayBuffer | Uint8Array");
  }

  if (buffer.length === 0) {
    throw new Error("extractTextFromPdf: buffer is empty");
  }

  // defensive check — PDF files start with "%PDF"
  const header = buffer.subarray(0, 4).toString("utf8");
  if (header !== "%PDF") {
    throw new Error("extractTextFromPdf: uploaded file is not a valid PDF");
  }

  // dynamic import so the module is only loaded at runtime
  const pdfParseModule: any = await import("pdf-parse");
  const pdfParse = pdfParseModule.default || pdfParseModule;

  try {
    // IMPORTANT: pass Buffer (never pass a string path)
    const data = await pdfParse(buffer);
    if (!data || typeof data.text !== "string") {
      throw new Error("pdf-parse returned unexpected result");
    }
    return data.text;
  } catch (err: any) {
    console.error("extractTextFromPdf -> pdf-parse failed:", { message: err?.message, stack: err?.stack });
    throw new Error(`pdf-parse error: ${err?.message ?? String(err)}`);
  }
}
