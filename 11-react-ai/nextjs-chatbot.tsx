// Next.js 15 AI Chatbot with Vercel AI SDK 4.0
"use client";

import { useChat } from "ai/react";
import { Bot, Send, User } from "lucide-react";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
          >
            {m.role === "assistant" && <Bot className="w-6 h-6" />}
            <div
              className={`rounded-lg p-3 ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              {m.content}
            </div>
            {m.role === "user" && <User className="w-6 h-6" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-6 py-2"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
