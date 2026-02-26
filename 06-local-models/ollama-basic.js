import ollama from "ollama";

async function basicChat() {
  console.log("🚀 Ollama Basic Demo\n");
  console.log("=".repeat(60));

  console.log("💡 Instalace Ollama:");
  console.log("   brew install ollama");
  console.log("   ollama pull llama3.1");
  console.log("   ollama pull codellama");
  console.log("   ollama pull qwen2.5-coder\n");

  try {
    console.log("🤖 Chatting with Llama 3.1...\n");

    const response = await ollama.chat({
      model: "llama3.1",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in JavaScript and modern web development.",
        },
        {
          role: "user",
          content:
            "Explain the difference between Promise.all and Promise.allSettled",
        },
      ],
    });

    console.log("Response:", response.message.content);
    console.log("\n📊 Metadata:");
    console.log(`   Model: ${response.model}`);
    console.log(
      `   Total duration: ${(response.total_duration / 1e9).toFixed(2)}s`,
    );
    console.log(
      `   Load duration: ${(response.load_duration / 1e9).toFixed(2)}s`,
    );
  } catch (error) {
    console.log("❌ Ollama není spuštěný nebo model není stažený");
    console.log("   Spusť: ollama serve");
    console.log("   Stáhni model: ollama pull llama3.1");
  }
}

async function streamingChat() {
  console.log("\n\n" + "=".repeat(60));
  console.log("📡 Streaming Response\n");

  try {
    const stream = await ollama.chat({
      model: "llama3.1",
      messages: [
        {
          role: "user",
          content: "Write a debounce function in JavaScript",
        },
      ],
      stream: true,
    });

    process.stdout.write("Response: ");

    for await (const chunk of stream) {
      process.stdout.write(chunk.message.content);
    }

    console.log("\n");
  } catch (error) {
    console.log("❌ Streaming demo vyžaduje běžící Ollama");
  }
}

async function codeGeneration() {
  console.log("\n" + "=".repeat(60));
  console.log("💻 Code Generation with CodeLlama\n");

  try {
    const response = await ollama.chat({
      model: "codellama",
      messages: [
        {
          role: "user",
          content: `Write a TypeScript function for email validation with these requirements:
- Type-safe
- Returns boolean
- Validates format
- Má unit testy`,
        },
      ],
    });

    console.log(response.message.content);
  } catch (error) {
    console.log("❌ CodeLlama není stažený");
    console.log("   Stáhni: ollama pull codellama");
  }
}

async function listModels() {
  console.log("\n" + "=".repeat(60));
  console.log("📚 Available Models\n");

  try {
    const models = await ollama.list();

    console.log("Installed models:");
    models.models.forEach((model) => {
      const sizeGB = (model.size / 1e9).toFixed(2);
      console.log(`   - ${model.name} (${sizeGB} GB)`);
    });

    console.log("\n💡 Doporučené modely pro coding:");
    console.log("   - qwen2.5-coder:7b (nejlepší coding model, prosinec 2024)");
    console.log("   - deepseek-coder-v2:16b (excelentní, ale větší)");
    console.log("   - codellama:13b (Meta, osvědčený)");
    console.log("   - llama3.1:8b (obecný, dobrý na vše)");
  } catch (error) {
    console.log("❌ Nelze načíst seznam modelů");
  }
}

async function embeddings() {
  console.log("\n" + "=".repeat(60));
  console.log("🔢 Embeddings Demo\n");

  try {
    const response = await ollama.embeddings({
      model: "llama3.1",
      prompt:
        "function validateEmail(email) { return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email); }",
    });

    console.log(
      `Generated embedding with ${response.embedding.length} dimensions`,
    );
    console.log(
      `First 5 values: [${response.embedding.slice(0, 5).join(", ")}...]`,
    );

    console.log("\n💡 Use case: Semantic code search");
    console.log("   1. Generate embeddings pro všechny funkce v codebase");
    console.log("   2. Ulož do vector DB (Chroma, Pinecone...)");
    console.log("   3. Search by meaning, ne jen keywords");
  } catch (error) {
    console.log("❌ Embeddings demo vyžaduje běžící Ollama");
  }
}

console.log("🦙 Ollama - Lokální LLM made easy\n");
console.log("=".repeat(60));

await basicChat();
await streamingChat();
await codeGeneration();
await listModels();
await embeddings();

console.log("\n" + "=".repeat(60));
console.log("📊 Ollama vs Cloud API\n");
console.log(`
| Aspect        | Ollama (Local)      | Cloud API           |
|---------------|---------------------|---------------------|
| Cost          | Free (po stažení)   | Pay per token       |
| Privacy       | 100% local          | Data sent to cloud  |
| Speed         | Fast (no network)   | Network latency     |
| Model choice  | Limited by RAM      | All models          |
| Quality       | Good (7B-13B)       | Best (GPT-4, Claude)|
| Offline       | ✅ Yes              | ❌ No               |
| Setup         | Easy (brew install) | API key only        |
`);

console.log("\n🎯 Kdy použít Ollama:");
console.log("   ✅ Prototyping a experimenty");
console.log("   ✅ Citlivá data (medical, legal...)");
console.log("   ✅ High-volume requests (úspora nákladů)");
console.log("   ✅ Offline development");
console.log("   ❌ Potřebuješ nejlepší kvalitu (použij GPT-4/Claude)");
console.log("   ❌ Nemáš dostatečný hardware (min 8GB RAM)");
