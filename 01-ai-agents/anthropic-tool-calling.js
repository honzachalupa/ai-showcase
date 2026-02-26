import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "demo-mode",
});

const tools = [
  {
    name: "execute_code",
    description:
      "Spustí Python kód a vrátí výsledek. Použij pro testování kódu nebo výpočty.",
    input_schema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Python kód k vykonání",
        },
        language: {
          type: "string",
          enum: ["python", "javascript"],
          description: "Programovací jazyk",
        },
      },
      required: ["code", "language"],
    },
  },
  {
    name: "search_documentation",
    description: "Vyhledá v dokumentaci frameworku nebo knihovny",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Vyhledávací dotaz",
        },
        framework: {
          type: "string",
          description: "Název frameworku (např. 'react', 'vue', 'express')",
        },
      },
      required: ["query", "framework"],
    },
  },
  {
    name: "analyze_performance",
    description: "Analyzuje výkon kódu a najde bottlenecky",
    input_schema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Kód k analýze",
        },
        metrics: {
          type: "array",
          items: {
            type: "string",
            enum: ["time_complexity", "space_complexity", "runtime"],
          },
          description: "Metriky k analýze",
        },
      },
      required: ["code", "metrics"],
    },
  },
];

function executeCode(code, language) {
  console.log(`\n🔧 Executing ${language} code...`);
  if (language === "python") {
    return {
      output: "42",
      execution_time: "0.003s",
      success: true,
    };
  }
  return { output: "Demo mode", success: true };
}

function searchDocumentation(query, framework) {
  console.log(`\n📚 Searching ${framework} docs for: "${query}"`);
  return {
    results: [
      {
        title: `${framework} - ${query}`,
        url: `https://docs.${framework}.dev/api/${query.toLowerCase()}`,
        snippet: "Relevantní dokumentace...",
      },
    ],
  };
}

function analyzePerformance(code, metrics) {
  console.log("\n⚡ Analyzing performance...");
  return {
    time_complexity: "O(n)",
    space_complexity: "O(1)",
    suggestions: ["Použij Map místo Object pro rychlejší lookup"],
  };
}

async function aiCodingAssistant(userRequest) {
  console.log(`\n👤 User: ${userRequest}\n`);

  const messages = [
    {
      role: "user",
      content: userRequest,
    },
  ];

  let response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    tools: tools,
    messages: messages,
  });

  console.log(`🤖 Claude: ${response.content[0].text || "(using tools...)"}`);

  while (response.stop_reason === "tool_use") {
    const toolUse = response.content.find((block) => block.type === "tool_use");

    console.log(`\n🔨 Tool: ${toolUse.name}`);
    console.log(`📥 Input:`, JSON.stringify(toolUse.input, null, 2));

    let toolResult;
    switch (toolUse.name) {
      case "execute_code":
        toolResult = executeCode(toolUse.input.code, toolUse.input.language);
        break;
      case "search_documentation":
        toolResult = searchDocumentation(
          toolUse.input.query,
          toolUse.input.framework,
        );
        break;
      case "analyze_performance":
        toolResult = analyzePerformance(
          toolUse.input.code,
          toolUse.input.metrics,
        );
        break;
    }

    console.log(`📤 Result:`, JSON.stringify(toolResult, null, 2));

    messages.push(
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: JSON.stringify(toolResult),
          },
        ],
      },
    );

    response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      tools: tools,
      messages: messages,
    });

    const textContent = response.content.find((block) => block.type === "text");
    if (textContent) {
      console.log(`\n🤖 Claude: ${textContent.text}`);
    }
  }

  return response;
}

if (process.env.ANTHROPIC_API_KEY) {
  console.log("🚀 Anthropic Tool Calling Demo\n");
  console.log("=".repeat(50));

  await aiCodingAssistant(
    "Write a function to calculate factorial in Python, run it with number 5 and analyze its performance",
  );
} else {
  console.log("ℹ️  Nastavte ANTHROPIC_API_KEY pro spuštění demo");
  console.log("📖 Tento příklad ukazuje:");
  console.log("   - Claude 3.5 Sonnet s tool calling");
  console.log("   - Multi-step reasoning s nástroji");
  console.log("   - Automatické volání funkcí podle kontextu");
  console.log("   - Iterativní conversation loop");
}
