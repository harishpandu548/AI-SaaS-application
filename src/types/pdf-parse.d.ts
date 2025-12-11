// src/types/pdf-parse.d.ts
declare module "pdf-parse" {
  export type PDFParseResult = {
    numpages?: number;
    numrender?: number;
    info?: any;
    metadata?: any;
    text: string;
    version?: string;
    formImage?: any;
  };

  function pdfParse(
    data: Buffer | Uint8Array | string,
    options?: any
  ): Promise<PDFParseResult>;

  export = pdfParse;
}
