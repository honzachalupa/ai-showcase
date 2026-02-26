import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

const tools = {
  getWeather: tool({
    description: 'Získá aktuální počasí pro dané město',
    parameters: z.object({
      city: z.string().describe('Název města'),
    }),
    execute: async ({ city }) => {
      console.log(`🌤️  Fetching weather for ${city}...`);
      return {
        city,
        temperature: 22,
        condition: 'sunny',
        humidity: 65
      };
    },
  }),
  
  searchCode: tool({
    description: 'Vyhledá kód v repository podle dotazu',
    parameters: z.object({
      query: z.string().describe('Vyhledávací dotaz'),
      fileType: z.string().optional().describe('Typ souboru (js, py, ts...)'),
    }),
    execute: async ({ query, fileType }) => {
      console.log(`🔍 Searching code: ${query} (${fileType || 'all'})`);
      return {
        results: [
          {
            file: 'src/auth.js',
            line: 42,
            code: 'const token = jwt.sign({ userId }, SECRET);'
          }
        ]
      };
    },
  }),

  runTests: tool({
    description: 'Spustí testy pro daný soubor',
    parameters: z.object({
      testFile: z.string().describe('Cesta k test souboru'),
    }),
    execute: async ({ testFile }) => {
      console.log(`🧪 Running tests: ${testFile}`);
      return {
        passed: 12,
        failed: 1,
        duration: '2.3s',
        failures: [
          { test: 'should validate token', error: 'Token expired' }
        ]
      };
    },
  }),
};

async function streamingChatDemo() {
  console.log('🚀 Vercel AI SDK 3.0 Demo\n');
  console.log('='.repeat(60));
  console.log('💡 Nové features:');
  console.log('   - Unified API pro všechny providery (OpenAI, Anthropic, Google...)');
  console.log('   - Native streaming s tool calling');
  console.log('   - Type-safe tools s Zod');
  console.log('   - React hooks (useChat, useCompletion)');
  console.log('   - Server-side streaming\n');

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: [
      {
        role: 'user',
        content: 'Jaké je počasí v Praze a najdi mi kód pro JWT autentizaci'
      }
    ],
    tools,
    maxSteps: 5,
  });

  console.log('\n📡 Streaming response:\n');
  
  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }

  console.log('\n\n🔧 Tool calls:');
  const toolCalls = await result.toolCalls;
  toolCalls.forEach(call => {
    console.log(`   - ${call.toolName}:`, call.args);
  });

  console.log('\n✅ Final result:');
  console.log(await result.text);
}

async function reactHookExample() {
  console.log('\n\n' + '='.repeat(60));
  console.log('⚛️  React Integration Example\n');

  const reactCode = `
import { useChat } from 'ai/react';

export default function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onToolCall: ({ toolCall }) => {
      console.log('Tool called:', toolCall.toolName);
    },
  });

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map(m => (
          <div key={m.id} className={\`message \${m.role}\`}>
            {m.content}
            
            {/* Zobrazení tool calls */}
            {m.toolInvocations?.map(tool => (
              <div key={tool.toolCallId} className="tool-call">
                🔧 {tool.toolName}: {JSON.stringify(tool.result)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Zeptej se..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
`;

  console.log(reactCode);

  console.log('\n📝 Server-side API route:\n');

  const apiCode = `
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
    tools: {
      getWeather: tool({
        description: 'Get weather',
        parameters: z.object({ city: z.string() }),
        execute: async ({ city }) => fetchWeather(city),
      }),
    },
  });

  return result.toDataStreamResponse();
}
`;

  console.log(apiCode);
}

async function multiProviderExample() {
  console.log('\n\n' + '='.repeat(60));
  console.log('🔄 Multi-Provider Support\n');

  const code = `
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Stejné API pro všechny providery!

// OpenAI
const result1 = await streamText({
  model: openai('gpt-4-turbo'),
  messages: [{ role: 'user', content: 'Hello' }],
});

// Anthropic Claude
const result2 = await streamText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  messages: [{ role: 'user', content: 'Hello' }],
});

// Google Gemini
const result3 = await streamText({
  model: google('gemini-pro'),
  messages: [{ role: 'user', content: 'Hello' }],
});

// Nebo dynamicky podle ENV
const provider = process.env.AI_PROVIDER || 'openai';
const models = {
  openai: openai('gpt-4-turbo'),
  anthropic: anthropic('claude-3-5-sonnet-20241022'),
  google: google('gemini-pro'),
};

const result = await streamText({
  model: models[provider],
  messages: [{ role: 'user', content: 'Hello' }],
});
`;

  console.log(code);

  console.log('\n💡 Výhody:');
  console.log('   ✅ Vendor lock-in prevence');
  console.log('   ✅ A/B testing různých modelů');
  console.log('   ✅ Fallback na jiný provider při výpadku');
  console.log('   ✅ Cost optimization (levnější model pro jednoduché úlohy)');
}

if (process.env.OPENAI_API_KEY) {
  await streamingChatDemo();
} else {
  console.log('ℹ️  Nastavte OPENAI_API_KEY pro live demo');
}

await reactHookExample();
await multiProviderExample();

console.log('\n\n📚 Další features:\n');
console.log('   - generateText() - non-streaming');
console.log('   - generateObject() - structured output');
console.log('   - embed() - embeddings');
console.log('   - useCompletion() - autocomplete');
console.log('   - useAssistant() - OpenAI Assistants API');
console.log('   - Middleware support');
console.log('   - Rate limiting');
console.log('   - Caching');
