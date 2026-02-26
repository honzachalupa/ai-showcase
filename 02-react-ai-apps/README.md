# React AI Applications (2026)

## Přehled

React ekosystém pro AI aplikace v roce 2026:

- **Vercel AI SDK 4.0** - AI-native React Server Components
- **Next.js 15** - App Router s AI integrací
- **React Server Components** - streaming AI responses
- **AI UI Components** - generative UI patterns
- **Nejnovější modely** - gpt-4o, claude-opus-4, gemini-2.0-flash

## Ukázky

1. **nextjs-ai-chatbot.tsx** - Plně funkční AI chatbot s Next.js 15
2. **streaming-ui.tsx** - Streaming AI responses s React Server Components
3. **ai-form-generator.tsx** - AI generuje formuláře z popisu
4. **code-preview.tsx** - Live code preview s AI suggestions
5. **ai-image-generator.tsx** - DALL-E 3 integrace v Reactu

## Tech Stack

- **Next.js 15** - App Router, Server Actions
- **Vercel AI SDK 4.0** - useChat, useCompletion, streamUI
- **React 19** - Server Components, Suspense
- **TypeScript** - Type-safe AI interactions
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI komponenty

## Klíčové koncepty

### 1. Streaming AI Responses

```tsx
"use client";

import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

### 2. React Server Components s AI

```tsx
import { streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";

export async function generateUI(prompt: string) {
  const result = await streamUI({
    model: openai("gpt-4-turbo"),
    prompt,
    text: ({ content }) => <div>{content}</div>,
    tools: {
      showWeather: {
        description: "Show weather",
        parameters: z.object({
          city: z.string(),
        }),
        generate: async ({ city }) => <WeatherCard city={city} />,
      },
    },
  });

  return result.value;
}
```

### 3. AI-Generated UI Components

```tsx
"use server";

import { generateObject } from "ai";
import { z } from "zod";

export async function generateForm(description: string) {
  const { object } = await generateObject({
    model: openai("gpt-4-turbo"),
    schema: z.object({
      fields: z.array(
        z.object({
          name: z.string(),
          type: z.enum(["text", "email", "number", "select"]),
          label: z.string(),
          required: z.boolean(),
          options: z.array(z.string()).optional(),
        }),
      ),
    }),
    prompt: `Generate a form based on: ${description}`,
  });

  return <DynamicForm fields={object.fields} />;
}
```

## Best Practices

### ✅ Do

- Používej React Server Components pro AI logic
- Streamuj responses pro lepší UX
- Implementuj error boundaries
- Cachuj AI responses kde možné
- Používej Suspense pro loading states
- Type-safe schemas s Zod

### ❌ Don't

- Neposílej API klíče na client
- Nevolej AI API přímo z client componentů
- Nezapomínej na rate limiting
- Neblokuj UI během AI requestů
- Neukládej citlivá data v AI promptech
