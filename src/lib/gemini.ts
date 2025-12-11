import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Gemini api key is not set in .env");
}

//creating a client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

//choosing model
export const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

//our function to generate blogpost text
export async function generateBlogPost(topic: string, tone: string) {
  const prompt = `
    You are a blog writer for a saas content platform
    write a blog post about: "${topic}"
    Tone: ${tone}
    Requirements:
    -clear style with headings and subheadings(h2/h3 style)
    -Intro, 2-3 main sections, and a conclusion
    -use simple language
    -500-600 words
    `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}

//we wrote email generator in api/email only (both ways we can do, either write here or else write there)

// Captions generator
export async function generateCaptions(topic: string, details: string) {
  const prompt = `
    You are an AI social media caption generator for a SaaS content platform.

Generate 2 high-quality captions.

Topic: "${topic}"
Platform details: "${details}"   // (e.g., Instagram, Facebook, short, aesthetic, funny, etc.)

Requirements:
- Captions must be simple, meaningful, and engaging.
- Match the style of the platform mentioned in details.
- Include a mix of short captions, aesthetic ones.
- No hashtags unless the user specifically asks.
- No emojis unless the platform typically uses them (e.g., Instagram).
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}


//pdf summarizer
export async function summarizePdfText(
  pdfText: string,
  instructions?: string
): Promise<string> {
  const basePrompt = `
You are an AI that summarizes PDF documents for users.

Summarize the following PDF content in clear bullet points and short paragraphs.
Focus on the main ideas and important details.
Ignore page numbers, headers, and footers.

${instructions ? `User extra instructions: ${instructions}\n` : ""}

PDF content:
"""${pdfText.slice(0, 20000)}"""
(Only use the text above for your answer.)
  `;

  const result = await model.generateContent(basePrompt);
  const response = result.response;
  const text = response.text();

  return text;
}

// export async function summarizePdfText(pdfText:string,extraInstructions?:string) {
//   const maxChars=8000;
//   const trimmedText=pdfText.length>maxChars?pdfText.slice(0,8000):pdfText

//   const prompt=`
//   You are an AI PDF summarizer.
//   The user uploaded a PDF. Below is the extracted text (may be partial if very long):

//   ${trimmedText}

//   Task: Summarize the main ideas of this PDF in clear bullet points and short paragraphs.
//   ${extraInstructions?`Extra instructions from user:${extraInstructions}`:""}
  
//   Requirements:
//   - Use simple, clear language.
//   - Highlight the key sections or topics.
//   - 6-10 bullet points is enough.
//   - If the text seems incomplete, say "This is a partial summary based on the visible content."

//   `
//   const result=await model.generateContent(prompt)
//   const response=result.response
//   const text=response.text()
//   return text
  
// }