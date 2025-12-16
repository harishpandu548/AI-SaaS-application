"use client";

import axios from "axios";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

type ChatSummary = {
  id: string;
  title: string | null;
  createdAt: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  existingChats: ChatSummary[];
};

function ChatClient({ existingChats }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey I am your assistant. How can i help you today",
    },
  ]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatList, setChatList] = useState(existingChats);
  const { refreshUser } = useUser();

  async function handleDeleteChat(id: string) {
    if (!confirm("Are you sure you want to delete this chat?")) return;
    try {
      await axios.post("/api/ai/chat/delete", { chatId: id });
      setChatList((prev) => prev.filter((c) => c.id !== id));
      if (id === chatId) {
        setChatId(null);
        setMessages([
          {
            role: "assistant",
            content: "Hey! I'm your AI assistant. How can I help you today?",
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete the chat");
    }
  }

  async function handleselectChat(id: string) {
    try {
      setLoadingChat(true);
      const res = await axios.get(`/api/ai/chat/history?chatId=${id}`);
      const data = res.data;

      const loadMessages: Message[] = (data.messages || []).map((m: any) => {
        const role: Message["role"] =
          m.role === "assistant" ? "assistant" : "user";
        const content = String(m.content ?? "");
        return { role, content };
      });

      setChatId(id);
      setMessages(
        loadMessages.length > 0
          ? [
              {
                role: "assistant",
                content: "Hey I am your assistant. How can i help you today",
              },
              ...loadMessages,
            ]
          : [
              {
                role: "assistant",
                content: "This chat has no messages yet",
              },
            ]
      );
    } catch (error) {
      console.error(error);
      alert(
        "Gemini API daily limit reached.\n\n" +
          "This project uses the Gemini free tier, which allows up to 20 AI responses per day.\n\n" +
          "Today's limit has been exhausted. Please try again tomorrow.\n\n" +
          "Note: Higher limits require a paid Gemini plan. This project demonstrates full AI SaaS functionality for evaluation purposes."
      );
    } finally {
      setLoadingChat(false);
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input;
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];

    setMessages(newMessages);
    setInput("");
    setSending(true);

    const apiMessages = newMessages.filter((m, index) => {
      if (index === 0 && m.role === "assistant") return false;
      return true;
    });

    try {
      const res = await axios.post("/api/ai/chat", {
        messages: apiMessages,
        chatId: chatId ?? undefined,
      });

      const data = res.data;
      await refreshUser();

      if (data.chatId && !chatId) {
        setChatId(data.chatId);
        setChatList((prev) => [
          {
            id: data.chatId,
            title: userMessage.slice(0, 30),
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: String(data.reply ?? ""),
        },
      ]);
    } catch (error: any) {
      console.error(error);
      alert("Something went wrong with the AI. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-3 sm:px-6 py-4 sm:py-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-pink-400/25 blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-40 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-purple-400/25 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900">
            AI Assistant
          </h1>
          <p className="text-zinc-600 mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Chat with your personal AI assistant. Your conversations are saved
            automatically.
          </p>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-[calc(100vh-220px)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="
              w-full lg:w-1/4
              rounded-3xl
              bg-white/30 backdrop-blur-2xl
              border border-purple-500/25
              shadow-[0_20px_60px_rgba(168,85,247,0.25)]
              p-3 sm:p-4 flex flex-col
              max-h-[40vh] lg:max-h-full
            "
          >
            <button
              onClick={() => {
                setChatId(null);
                setMessages([
                  {
                    role: "assistant",
                    content:
                      "Hey I am your assistant. How can i help you today",
                  },
                ]);
              }}
              className="
                mb-3 sm:mb-4 py-2 rounded-xl
                bg-gradient-to-r from-pink-500 to-purple-600
                text-white font-medium
                hover:shadow-[0_0_25px_rgba(168,85,247,0.45)]
                text-sm
              "
            >
              + New Chat
            </button>

            <h2 className="font-semibold text-zinc-800 mb-2 sm:mb-3 text-sm">
              Your chats
            </h2>

            <ul className="space-y-2 overflow-y-auto">
              {chatList.map((chat) => (
                <li
                  key={chat.id}
                  className={`
                    group rounded-xl px-3 py-2 text-sm cursor-pointer
                    flex justify-between items-center
                    transition-all
                    ${
                      chat.id === chatId
                        ? "bg-gradient-to-r from-pink-500/30 to-purple-500/30 ring-2 ring-purple-400/40"
                        : "bg-white/30 hover:bg-white/50"
                    }
                  `}
                >
                  <span
                    onClick={() => handleselectChat(chat.id)}
                    className="flex-1 truncate"
                  >
                    {chat.title || "New chat"}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                    className="ml-2 text-red-500 text-xs opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="
              flex-1 rounded-3xl
              bg-white/30 backdrop-blur-2xl
              border border-purple-500/25
              shadow-[0_20px_60px_rgba(168,85,247,0.25)]
              flex flex-col
              min-h-0
            "
          >
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm
                      ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "bg-white/70 text-zinc-800"
                      }
                    `}
                  >
                    {m.role === "assistant" ? (
                      <article className="prose prose-sm max-w-none text-zinc-800">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </article>
                    ) : (
                      <span>{m.content}</span>
                    )}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="text-zinc-500 italic text-sm">
                  AI is thinking…
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4 border-t border-white/40 flex gap-2 sm:gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="
                  flex-1 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3
                  bg-white/60 backdrop-blur
                  border border-purple-500/30
                  focus:outline-none
                  focus:ring-2 focus:ring-pink-500/60
                  text-sm
                "
                placeholder="Type your message..."
              />
              <button
                onClick={sendMessage}
                disabled={sending}
                className="
                  px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium
                  bg-gradient-to-r from-pink-500 to-purple-600
                  text-white disabled:opacity-50
                  text-sm
                "
              >
                Send
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default ChatClient;
