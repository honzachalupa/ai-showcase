#!/usr/bin/env node

/**
 * Automatický generátor AI trends aktualizací (každé 2 týdny)
 *
 * Používá GPT-5.3-Codex - nejnovější a nejschopnější model (5.2.2026)
 *
 * Tento script:
 * 1. Dotazuje AI na nejnovější trendy za poslední 2 týdny
 * 2. Aktualizuje TRENDS.md
 * 3. Aktualizuje README.md s novými informacemi
 * 4. Přidává nové ukázky pokud jsou relevantní
 */

import fs from "fs/promises";
import OpenAI from "openai";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getCurrentTrends() {
  console.log("🔍 Zjišťuji nejnovější AI trendy...");

  const currentDate = new Date().toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "long",
  });

  const prompt = `You are an AI expert tracking the latest trends in AI-assisted software development.

Current date: ${currentDate}

Task: Identify the TOP 3-5 newest changes/trends in AI development from the last 2 weeks.

Focus on:
- New models (GPT, Claude, Gemini, open-source)
- New frameworks and tools
- Breakthroughs in capabilities (reasoning, multimodal, context window)
- New coding assistants or features
- Production-ready technologies

For each trend, provide:
1. Name and release date
2. Key features
3. Practical impact for developers
4. Comparison with previous state

Format: JSON
{
  "trends": [
    {
      "title": "...",
      "date": "...",
      "category": "models|frameworks|tools|capabilities",
      "description": "...",
      "impact": "...",
      "examples": ["..."]
    }
  ],
  "summary": "Brief summary of the period"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.3-codex", // Nejnovější a nejschopnější model (5.2.2026)
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  return JSON.parse(response.choices[0].message.content);
}

async function updateTrendsFile(trends) {
  console.log("📝 Aktualizuji TRENDS.md...");

  const trendsPath = path.join(process.cwd(), "TRENDS.md");
  const currentContent = await fs.readFile(trendsPath, "utf-8");

  const currentDate = new Date().toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "long",
  });

  // Vytvoř novou sekci pro tento měsíc
  const newSection = `
## 📅 Aktualizace ${currentDate}

${trends.summary}

### Nové trendy

${trends.trends
  .map(
    (trend, i) => `
#### ${i + 1}. ${trend.title} (${trend.date})

**Kategorie:** ${trend.category}

${trend.description}

**Praktický dopad:**
${trend.impact}

${
  trend.examples.length > 0
    ? `**Příklady použití:**
${trend.examples.map((ex) => `- ${ex}`).join("\n")}`
    : ""
}
`,
  )
  .join("\n")}

---
`;

  // Vlož novou sekci za timeline
  const timelineEnd = currentContent.indexOf("---\n\n# ČÁST 1");
  if (timelineEnd !== -1) {
    const updatedContent =
      currentContent.slice(0, timelineEnd) +
      "---\n" +
      newSection +
      currentContent.slice(timelineEnd + 4);

    await fs.writeFile(trendsPath, updatedContent, "utf-8");
    console.log("✅ TRENDS.md aktualizován");
  }
}

async function updateReadme(trends) {
  console.log("📝 Aktualizuji README.md...");

  const readmePath = path.join(process.cwd(), "README.md");
  const currentContent = await fs.readFile(readmePath, "utf-8");

  const currentDate = new Date().toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Aktualizuj datum v hlavičce
  const updatedContent = currentContent.replace(
    /Přehled klíčových trendů ve vývoji softwaru s pomocí AI \(aktualizováno [^)]+\)/,
    `Přehled klíčových trendů ve vývoji softwaru s pomocí AI (aktualizováno ${currentDate})`,
  );

  await fs.writeFile(readmePath, updatedContent, "utf-8");
  console.log("✅ README.md aktualizován");
}

async function generateChangelogEntry(trends) {
  console.log("📋 Generuji CHANGELOG...");

  const changelogPath = path.join(process.cwd(), "CHANGELOG.md");

  const currentDate = new Date().toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const entry = `
## [${currentDate}]

### Přidáno
${trends.trends
  .filter((t) => t.category === "models" || t.category === "tools")
  .map((t) => `- ${t.title}: ${t.description.split("\n")[0]}`)
  .join("\n")}

### Změněno
${trends.trends
  .filter((t) => t.category === "capabilities" || t.category === "frameworks")
  .map((t) => `- ${t.title}: ${t.impact.split("\n")[0]}`)
  .join("\n")}

### Shrnutí
${trends.summary}

---
`;

  let changelog = "";
  try {
    changelog = await fs.readFile(changelogPath, "utf-8");
  } catch {
    changelog = "# Changelog\n\nVšechny významné změny v tomto projektu.\n\n";
  }

  // Přidej nový entry na začátek
  const updatedChangelog = changelog.replace(
    /# Changelog\n\n[^\n]+\n\n/,
    `# Changelog\n\nVšechny významné změny v tomto projektu.\n\n${entry}`,
  );

  await fs.writeFile(changelogPath, updatedChangelog, "utf-8");
  console.log("✅ CHANGELOG.md aktualizován");
}

async function main() {
  try {
    console.log("🚀 Spouštím automatickou aktualizaci AI trendů...\n");

    // 1. Získej nejnovější trendy
    const trends = await getCurrentTrends();
    console.log(`\n✅ Nalezeno ${trends.trends.length} nových trendů\n`);

    // 2. Aktualizuj soubory
    await updateTrendsFile(trends);
    await updateReadme(trends);
    await generateChangelogEntry(trends);

    console.log("\n✨ Aktualizace dokončena!");
    console.log("\n📊 Shrnutí:");
    console.log(`   - ${trends.trends.length} nových trendů`);
    console.log(`   - TRENDS.md aktualizován`);
    console.log(`   - README.md aktualizován`);
    console.log(`   - CHANGELOG.md aktualizován`);
  } catch (error) {
    console.error("❌ Chyba při aktualizaci:", error);
    process.exit(1);
  }
}

main();
