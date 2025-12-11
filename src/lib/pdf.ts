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
