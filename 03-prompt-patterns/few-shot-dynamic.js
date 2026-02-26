class DynamicFewShotPrompting {
  constructor() {
    this.exampleDatabase = [
      {
        category: "validation",
        tags: ["email", "regex", "input"],
        input: "Validuj email",
        output: `
export function validateEmail(email) {
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regex.test(email);
}

// Tests
console.assert(validateEmail('test@example.com') === true);
console.assert(validateEmail('invalid') === false);
`,
      },
      {
        category: "validation",
        tags: ["password", "security", "regex"],
        input: "Validuj silné heslo",
        output: `
export function validatePassword(password) {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  
  return password.length >= minLength && 
         hasUpper && hasLower && hasNumber && hasSpecial;
}
`,
      },
      {
        category: "async",
        tags: ["promise", "error-handling", "retry"],
        input: "Retry mechanismus pro API call",
        output: `
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}
`,
      },
      {
        category: "async",
        tags: ["debounce", "performance", "optimization"],
        input: "Debounce funkce pro search",
        output: `
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage
const searchInput = document.querySelector('#search');
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
`,
      },
      {
        category: "data-structures",
        tags: ["cache", "lru", "optimization"],
        input: "LRU Cache implementace",
        output: `
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}
`,
      },
    ];
  }

  findRelevantExamples(userQuery, k = 2) {
    const queryWords = userQuery.toLowerCase().split(" ");

    const scored = this.exampleDatabase.map((example) => {
      let score = 0;

      queryWords.forEach((word) => {
        if (example.tags.some((tag) => tag.includes(word))) score += 3;
        if (example.category.includes(word)) score += 2;
        if (example.input.toLowerCase().includes(word)) score += 1;
      });

      return { example, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map((item) => item.example);
  }

  buildPrompt(userQuery) {
    const examples = this.findRelevantExamples(userQuery);

    let prompt =
      "Write high-quality, production-ready code based on these examples:\n\n";

    examples.forEach((example, i) => {
      prompt += `Example ${i + 1}:\n`;
      prompt += `Input: ${example.input}\n`;
      prompt += `Output:\n${example.output}\n\n`;
    });

    prompt += `Nyní vyřeš:\nInput: ${userQuery}\nOutput:`;

    return { prompt, examples };
  }

  async generate(userQuery) {
    console.log("🎯 Dynamic Few-Shot Prompting\n");
    console.log("=".repeat(60));
    console.log(`User Query: "${userQuery}"\n`);

    const { prompt, examples } = this.buildPrompt(userQuery);

    console.log("📚 Selected Examples:");
    examples.forEach((ex, i) => {
      console.log(`   ${i + 1}. ${ex.input} [${ex.tags.join(", ")}]`);
    });

    console.log("\n📝 Generated Prompt:");
    console.log("-".repeat(60));
    console.log(prompt);
    console.log("-".repeat(60));

    console.log("\n💡 Proč dynamické few-shot:");
    console.log("   - Vybírá nejrelevantnější příklady");
    console.log("   - Lepší než random příklady");
    console.log("   - Konzistentní output formát");
    console.log("   - Škáluje s růstem example databáze");

    return prompt;
  }
}

const prompter = new DynamicFewShotPrompting();

console.log("Demo 1: Validation task\n");
await prompter.generate("Validace telefonního čísla");

console.log("\n\n" + "=".repeat(60) + "\n");
console.log("Demo 2: Async task\n");
await prompter.generate("Throttle funkce pro scroll event");

console.log("\n\n" + "=".repeat(60) + "\n");
console.log("Demo 3: Data structure task\n");
await prompter.generate("Implementuj LFU cache");

console.log("\n\n📊 Comparison\n");
console.log("=".repeat(60));
console.log(`
| Approach           | Pros                          | Cons                    |
|--------------------|-------------------------------|-------------------------|
| Zero-shot          | Jednoduchý, rychlý            | Méně přesný             |
| Static few-shot    | Lepší než zero-shot           | Irelevantní příklady    |
| Dynamic few-shot   | Nejvyšší přesnost             | Potřebuje example DB    |
| Fine-tuning        | Nejlepší výkon                | Drahé, složité          |

🎯 Kdy použít Dynamic Few-Shot:
   ✅ Máš databázi kvalitních příkladů
   ✅ Potřebuješ konzistentní output
   ✅ Různé typy úloh (validace, async, data structures...)
   ✅ Chceš lepší výsledky než zero-shot bez fine-tuningu
`);
