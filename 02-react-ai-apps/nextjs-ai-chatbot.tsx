// Next.js 15 AI Chatbot with Vercel AI SDK 4.0
// app/chat/page.tsx

"use client";

import { useChat } from "ai/react";
import { Bot, Loader2, Send, User } from "lucide-react";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      initialMessages: [
        {
          id: "1",
          role: "assistant",
          content: "Ahoj! Jsem AI asistent. Jak ti můžu pomoct?",
        },
      ],
    });

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6" />
          AI Chatbot (GPT-4 Turbo)
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Powered by Vercel AI SDK 4.0 + Next.js 15
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}

            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>

            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Odeslat
        </button>
      </form>
    </div>
  );
}

// API Route: app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o"), // Nejnovější GPT-4 model (únor 2026)
    messages,
    system: `You are a helpful AI assistant. You respond in Czech.
             Be friendly, concise, and specific.`,
    temperature: 0.7,
    maxTokens: 500,
  });

  return result.toDataStreamResponse();
}

// package.json dependencies:
/*
{
  "dependencies": {
    "ai": "^4.0.0",
    "@ai-sdk/openai": "^0.1.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "lucide-react": "^0.400.0"
  }
}
*/

// .env.local:
// OPENAI_API_KEY=sk-...

// Spuštění:
// npm install
// npm run dev
// Otevři http://localhost:3000/chat
