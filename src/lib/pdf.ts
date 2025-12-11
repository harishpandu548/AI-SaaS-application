// src/lib/pdf.ts
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

  // Basic sanity checks
  if (!buffer || buffer.length === 0) {
    throw new Error("extractTextFromPdf: buffer is empty");
  }

  // Check PDF magic bytes ("%PDF")
  const header = buffer.subarray(0, 4).toString("utf8");
  if (header !== "%PDF") {
    console.error("extractTextFromPdf: buffer does not start with %PDF header", {
      header,
      firstBytes: buffer.subarray(0, 16).toString("hex"),
      length: buffer.length,
    });
    throw new Error("extractTextFromPdf: uploaded file is not a valid PDF");
  }

  // dynamic import of pdf-parse
  const pdfParseModule: any = await import("pdf-parse");
  const pdfParse = pdfParseModule.default || pdfParseModule;

  try {
    const data = await pdfParse(buffer);
    if (!data || typeof data.text !== "string") {
      throw new Error("pdf-parse returned unexpected result");
    }
    return data.text;
  } catch (err: any) {
    // Log full error and stack to Vercel logs — very helpful for debugging
    console.error("extractTextFromPdf -> pdf-parse failed:", {
      message: err?.message,
      stack: err?.stack,
      // small sample of buffer so we can inspect it if needed (hex of first 64 bytes)
      sampleFirst64Bytes: buffer.subarray(0, Math.min(64, buffer.length)).toString("hex"),
      bufferLength: buffer.length,
    });

    // Re-throw a clear error so caller returns details (but include original message)
    throw new Error(`pdf-parse error: ${err?.message ?? String(err)}`);
  }
}


// await import("pdf-parse") is  Dynamic import, because pdf-parse is CommonJS.

// pdfParseModule.default || pdfParseModule
// → In CJS, the function might be:
// on .default, or
// directly the module itself.
// So you safely grab whichever exists.

// so at last we get the text in data.text(extracted text from pdf)