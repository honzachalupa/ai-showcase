import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "demo-mode",
});

const LARGE_CODEBASE_CONTEXT = `
// utils/validation.js
export function validateEmail(email) {
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password) {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
}

// services/userService.js
import { validateEmail, validatePassword } from './utils/validation.js';

export class UserService {
  constructor(db) {
    this.db = db;
  }

  async createUser(email, password) {
    if (!validateEmail(email)) {
      throw new Error('Invalid email');
    }
    if (!validatePassword(password)) {
      throw new Error('Weak password');
    }
    return this.db.users.create({ email, password });
  }

  async findByEmail(email) {
    return this.db.users.findOne({ email });
  }
}

// controllers/authController.js
import { UserService } from '../services/userService.js';
import jwt from 'jsonwebtoken';

export class AuthController {
  constructor(userService) {
    this.userService = userService;
  }

  async register(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.createUser(email, password);
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.json({ token, user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.findByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
`.repeat(10); // Simulace velkého codebase

async function demonstratePromptCaching() {
  console.log("🚀 Prompt Caching Demo\n");
  console.log("=".repeat(60));

  console.log("📊 Bez cachingu:");
  console.log("   - Každý request platí za celý context");
  console.log("   - Velký codebase = vysoké náklady");
  console.log("   - Pomalé response times\n");

  console.log("✨ S cachingem (Anthropic):");
  console.log("   - První request: plná cena");
  console.log("   - Další requesty: 90% úspora na cached části");
  console.log("   - Cache platí 5 minut");
  console.log("   - Ideální pro: code review, dokumentace, velké kontexty\n");

  const questions = [
    "Najdi všechny bezpečnostní problémy v tomto kódu",
    "Navrhni unit testy pro UserService",
    "Jak bych měl refaktorovat AuthController?",
  ];

  for (let i = 0; i < questions.length; i++) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📝 Question ${i + 1}: ${questions[i]}\n`);

    if (process.env.ANTHROPIC_API_KEY) {
      const startTime = Date.now();

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: [
          {
            type: "text",
            text: "You are an expert in code review and security.",
          },
          {
            type: "text",
            text: `Zde je codebase k analýze:\n\n${LARGE_CODEBASE_CONTEXT}`,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content: questions[i],
          },
        ],
      });

      const duration = Date.now() - startTime;

      console.log(
        `🤖 Response: ${response.content[0].text.substring(0, 200)}...`,
      );
      console.log(`\n⏱️  Duration: ${duration}ms`);
      console.log(`💰 Usage:`);
      console.log(`   - Input tokens: ${response.usage.input_tokens}`);
      console.log(
        `   - Cache creation: ${response.usage.cache_creation_input_tokens || 0}`,
      );
      console.log(
        `   - Cache read: ${response.usage.cache_read_input_tokens || 0}`,
      );
      console.log(`   - Output tokens: ${response.usage.output_tokens}`);

      if (i === 0) {
        console.log(`\n   💡 První request - vytváří cache`);
      } else {
        const savings = response.usage.cache_read_input_tokens || 0;
        console.log(
          `\n   💡 Cache hit! Ušetřeno ~${savings} tokenů (90% úspora)`,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      console.log(`🤖 Response: [Demo mode - nastavte ANTHROPIC_API_KEY]`);
      console.log(
        `\n💡 ${i === 0 ? "První request by vytvořil cache" : "Tento request by použil cache - 90% úspora!"}`,
      );
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("\n📈 Úspora nákladů:");
  console.log("   - Bez cachingu: 3x plná cena");
  console.log("   - S cachingem: 1x plná cena + 2x 10% cena");
  console.log("   - Celková úspora: ~60% na opakovaných dotazech");

  console.log("\n🎯 Kdy použít prompt caching:");
  console.log("   ✅ Velké codebase jako context");
  console.log("   ✅ Dokumentace, API reference");
  console.log("   ✅ Opakované dotazy na stejný context");
  console.log("   ✅ Chat aplikace s dlouhou historií");
  console.log("   ❌ Jednorázové dotazy");
  console.log("   ❌ Rychle se měnící context");
}

await demonstratePromptCaching();
