import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import ChatClient from "./client";
import { prisma } from "@/lib/db";

async function ChatPage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const dbChats = await prisma.chat.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  const userChats = dbChats.map((c) => ({
    id: c.id,
    title: c.title,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div>
      <ChatClient existingChats={userChats} />
    </div>
  );
}

export default ChatPage;
