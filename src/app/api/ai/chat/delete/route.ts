import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { chatId } = await req.json();

  if (!chatId) {
    return NextResponse.json({ error: "chatId required" }, { status: 400 });
  }

  //ensure chat belongs to that user
  const chat = await prisma.chat.findFirst({
    where: { id: chatId, userId: session.user?.id },
  });

  if (!chat) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }
  // delete the chat before delete all its messages
  await prisma.chatMessage.deleteMany({
    where: { chatId },
  });
  //   now chat will be emplty so now delete the chat
  await prisma.chat.delete({
    where: { id: chatId },
  });

  return NextResponse.json({ success: true });
}
