"use client";

import axios from "axios";
import { NextResponse } from "next/server";
import React, { useState } from "react";

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
  //   console.log("user chats:", existingChats);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey I am your assistant. How can i help you today",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatList, setChatList] = useState(existingChats);

  // delete the chat
  async function handleDeleteChat(id: string) {
    if (!confirm("Are you sure you want to delete this chat?")) return;
    try {
      const res = await axios.post("/api/ai/chat/delete", { chatId: id });
      const data = res.data;

      //it removes chat but when on refresh only u see so lets manually do it when deleted also without refresh lets delete the chat with title
      setChatList((prev) => prev.filter((c) => c.id !== id));
      // if we deleted the currently open chat then reset to refresh
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

  //load messages for a clicked chat
  async function handleselectChat(id: string) {
    try {
      setLoading(true);
      const res = await axios.get(`/api/ai/chat/history?chatId=${id}`);
      const data = res.data;

      //backend returns the chat msgs format we set (we setted it in that format so we get like that now)
      const loadMessages: Message[] = (data.messages || []).map((m: any) => {
        const role: Message["role"] =
          m.role === "assistant" ? "assistant" : "user";
        const content = String(m.content ?? "");
        return { role, content } as Message;
      });
      //update the state
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
      alert("Failed to get the chat");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const apiMessages = newMessages.filter((m, index) => {
      if (index === 0 && m.role === "assistant") return false;
      return true;
    });

    try {
      const res = await axios.post("/api/ai/chat", {
        messages: apiMessages,
        chatId: chatId ?? undefined, // send undefined instead of null
      });

      const data = res.data;
      console.log("CHAT API RESPONSE:", data);

      if (data.chatId && !chatId) {
        setChatId(data.chatId);
        //now user clicked on new chat lets make the existing chat comes to left side
        setChatList((prev) => [
          {
            id: data.chatId,
            title: data.title || "Untitled chat",
            createdAt: data.createdAt || new Date().toISOString(),
          },
          ...prev,
        ]);
      }
      //ensure reply is string and matches msg type
      const assistantReply: Message = {
        role: "assistant",
        content: String(data.reply ?? ""),
      };
      setMessages((prev) => [...prev, assistantReply]);
    } catch (error: any) {
      console.error(error);
      const apiError = error?.response?.data;
      if (apiError?.details?.includes("RetryInfo")) {
        alert(
          "AI is overloaded or rate limited. Please wait a bit and try again."
        );
      } else {
        alert("Something went wrong with the AI. Please try again.");
      }
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto h-[80vh] flex gap-4">
      {/* LEFT: chat history list */}

      <div className="w-1/4 border rounded p-3 overflow-y-auto">
        {/* new chat button to create a new chat */}
        <button
          onClick={() => {
            setChatId(null);
            setMessages([
              {
                role: "assistant",
                content: "Hey I am your assistant. How can i help you today",
              },
            ]);
          }}
        >
          + New Chat
        </button>

        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Your chats</h2>
        </div>

        {chatList.length === 0 && (
          <p className="text-sm text-gray-500">
            No chats yet. Start a new one!
          </p>
        )}

        <ul className="space-y-2">
          {chatList.map((chat) => (
            <li
              key={chat.id}
              className={`border rounded px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
                chat.id === chatId ? "bg-gray-200" : ""
              }`}
            >
              <span
                onClick={() => handleselectChat(chat.id)}
                className="flex-1"
              >
                {chat.title || "Untitled chat"}
              </span>

              {/* DELETE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent opening chat when deleting
                  handleDeleteChat(chat.id);
                }}
                className="ml-2 text-red-500 hover:text-red-700 text-xs"
              >
                ✕ Delete Chat
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT: current chat */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto border p-4 rounded">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-4 ${m.role === "user" ? "text-right" : ""}`}
            >
              <div
                className={`inline-block px-3 py-2 rounded-lg ${
                  m.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="mt-2 text-gray-500 italic">Thinking...</div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded px-3 py-2 text-black"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="border px-4 py-2 rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatClient;
