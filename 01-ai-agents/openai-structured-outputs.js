import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "demo-mode",
});

async function extractCodeReviewWithStructuredOutputs() {
  const code = `
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content:
          "You are a code review expert. Analyze the code and return structured feedback.",
      },
      {
        role: "user",
        content: `Zkontroluj tento kód:\n\n${code}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "code_review",
        strict: true,
        schema: {
          type: "object",
          properties: {
            overall_quality: {
              type: "string",
              enum: ["excellent", "good", "needs_improvement", "poor"],
            },
            issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  severity: {
                    type: "string",
                    enum: ["critical", "warning", "suggestion"],
                  },
                  line: { type: "number" },
                  description: { type: "string" },
                  suggestion: { type: "string" },
                },
                required: ["severity", "description", "suggestion"],
                additionalProperties: false,
              },
            },
            positive_aspects: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["overall_quality", "issues", "positive_aspects"],
          additionalProperties: false,
        },
      },
    },
  });

  const review = JSON.parse(response.choices[0].message.content);

  console.log("📊 Code Review Results:");
  console.log("Quality:", review.overall_quality);
  console.log("\n🔍 Issues:");
  review.issues.forEach((issue) => {
    console.log(`  [${issue.severity.toUpperCase()}] ${issue.description}`);
    console.log(`  💡 ${issue.suggestion}\n`);
  });
  console.log("✅ Positive aspects:");
  review.positive_aspects.forEach((aspect) => console.log(`  - ${aspect}`));

  return review;
}

async function generateTestsWithStructuredOutputs() {
  const functionCode = `
export function validateEmail(email) {
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regex.test(email);
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "user",
        content: `Vygeneruj unit testy pro tuto funkci:\n\n${functionCode}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "test_suite",
        strict: true,
        schema: {
          type: "object",
          properties: {
            test_cases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  input: { type: "string" },
                  expected_output: { type: "boolean" },
                  category: {
                    type: "string",
                    enum: ["valid", "invalid", "edge_case"],
                  },
                },
                required: ["name", "input", "expected_output", "category"],
                additionalProperties: false,
              },
            },
          },
          required: ["test_cases"],
          additionalProperties: false,
        },
      },
    },
  });

  const tests = JSON.parse(response.choices[0].message.content);

  console.log("\n🧪 Generated Test Cases:");
  tests.test_cases.forEach((test, i) => {
    console.log(`\n${i + 1}. ${test.name} [${test.category}]`);
    console.log(`   Input: "${test.input}"`);
    console.log(`   Expected: ${test.expected_output}`);
  });

  return tests;
}

if (process.env.OPENAI_API_KEY) {
  console.log("🚀 OpenAI Structured Outputs Demo\n");
  console.log("=".repeat(50));

  await extractCodeReviewWithStructuredOutputs();
  await generateTestsWithStructuredOutputs();
} else {
  console.log("ℹ️  Nastavte OPENAI_API_KEY pro spuštění demo");
  console.log("📖 Tento příklad ukazuje:");
  console.log("   - Structured Outputs s garantovaným JSON schema");
  console.log("   - Žádné parsování, 100% validní výstup");
  console.log("   - Enum typy pro konzistentní kategorie");
}
