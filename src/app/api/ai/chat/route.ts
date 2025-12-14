import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({model: "gemini-2.5-flash" });

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages, chatId } = await req.json();
  const userId = session.user?.id;

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "Messages array required" },
      { status: 400 }
    );
  }

  //fetch user to credits checking if credits having allow chatting if not give a msg u don't have credits
  const user = await prisma.user.findUnique({
    where: { id: session.user?.id },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.plan === "FREE" && user.credits <= 0) {
    return NextResponse.json(
      { error: "No credits left. Upgrade to PRO" },
      { status: 403 }
    );
  }

  //if no chat create chat and assign it the id and name the first chat as title
  let currentChatId = chatId;
  if (!currentChatId) {
    const firstMessage = messages[0]?.content || "New Chat";
    const newChat = await prisma.chat.create({
      data: {
        userId,
        title: firstMessage.slice(0, 50), //first 50 char as title
      },
    });
    currentChatId = newChat.id;
  }

  //save user messages to db
  const lastUserMessage = messages[messages.length - 1];
  await prisma.chatMessage.create({
    data: {
      chatId: currentChatId,
      role: "user",
      content: lastUserMessage.content,
    },
  });

  try {
    //preparing the chat
    const chat = model.startChat({
      history: messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    });

    //send the message user typed and gemini based on that msg genrate reply
    const reply = await chat.sendMessage(messages[messages.length - 1].content);
    // output is gemini typed output
    const output = await reply.response.text();

    //save assistant msgs to db
    await prisma.chatMessage.create({
      data: {
        chatId: currentChatId,
        role: "assistant",
        content: output,
      },
    });

    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: user.id },
        data: { credits: user.credits - 1 },
      });
    }
    return NextResponse.json({ reply: output, chatId: currentChatId });
  } catch (err) {
    console.error("AI_CHAT_ERROR:", err);

    return NextResponse.json(
      {
        error: "AI error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
