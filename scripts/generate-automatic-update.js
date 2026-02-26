import fs from "fs/promises";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = "gpt-5.2"; // Nejnovější dostupný model (únor 2026)

async function readFile(filePath) {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return "";
  }
}

async function writeFile(filePath, content) {
  try {
    await fs.writeFile(filePath, content, "utf-8");
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error.message);
  }
}

async function generateUpdate() {
  console.log("🤖 Starting automatic AI trends update...\n");

  const trendsContent = await readFile("TRENDS.md");
  const readmeContent = await readFile("README.md");
  const modelRecsContent = await readFile("MODEL-RECOMMENDATIONS.md");
  const changelogContent = await readFile("CHANGELOG.md");

  const currentDate = new Date().toLocaleDateString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const prompt = `You are an AI expert tracking the latest trends in AI-assisted software development.

## Task
Analyze the latest AI development trends from the past 2 weeks and update the repository documentation.

## Current Date
${currentDate}

## Steps

1. **Research Latest Trends**
   - Search for new AI models released in the last 2 weeks (GPT, Claude, Gemini, open-source)
   - Find new frameworks and tools announcements
   - Identify breakthroughs in capabilities (reasoning, multimodal, context window)
   - Look for new coding assistants or features
   - Focus on production-ready technologies

2. **Update TRENDS.md**
   - Add a new section with current date (format: "## 📅 Update [Month Year]")
   - Include 3-5 most significant trends
   - For each trend provide:
     - Title and release date
     - Category (models|frameworks|tools|capabilities)
     - Key features
     - Practical impact for developers
     - Comparison with previous state
   - Keep the format consistent with existing entries

3. **Update MODEL-RECOMMENDATIONS.md**
   - Update model rankings if new models were released
   - Update pricing information if changed
   - Add new models to comparison tables
   - Update "Last updated" date at the top

4. **Update README.md**
   - Update the "Last updated" date
   - Add new trends to the highlights section if significant
   - Ensure all links are working

5. **Update CHANGELOG.md**
   - Add new entry with format: "## [Date] - Automatic Update"
   - List all significant changes made

## Output Requirements
- Write in Czech language for user-facing content
- Use English for code examples and technical terms
- Keep formatting consistent with existing files
- Include proper markdown formatting with emojis
- Ensure all dates use DD.MM.YYYY format

## CRITICAL: What NOT to change
- DO NOT remove or modify markdown code fence markers (\`\`\`markdown, \`\`\`, etc.)
- DO NOT change existing file paths or links
- DO NOT reformat existing sections
- DO NOT remove existing content
- ONLY ADD new sections for recent trends
- ONLY UPDATE "Last updated" dates
- ONLY ADD new entries to CHANGELOG

## Quality Checks
- Verify all information is accurate and from reliable sources
- Ensure no duplicate content
- Check that all markdown links work
- Maintain consistent formatting throughout
- Only include trends from the last 2 weeks

## Current Files

### TRENDS.md
\`\`\`markdown
${trendsContent.slice(0, 5000)}
\`\`\`

### MODEL-RECOMMENDATIONS.md
\`\`\`markdown
${modelRecsContent.slice(0, 3000)}
\`\`\`

### README.md
\`\`\`markdown
${readmeContent.slice(0, 2000)}
\`\`\`

### CHANGELOG.md
\`\`\`markdown
${changelogContent.slice(0, 2000)}
\`\`\`

Please provide the updated content for each file. Format your response as JSON:
{
  "trends": "updated TRENDS.md content",
  "modelRecommendations": "updated MODEL-RECOMMENDATIONS.md content",
  "readme": "updated README.md content",
  "changelog": "updated CHANGELOG.md content"
}`;

  console.log("🔍 Searching for latest AI trends...\n");

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert AI researcher who tracks the latest developments in AI and machine learning. You have access to current information and can search the web for the latest news.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 16000,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);

    console.log("📝 Writing updated files...\n");

    await writeFile("TRENDS.md", result.trends);
    await writeFile("MODEL-RECOMMENDATIONS.md", result.modelRecommendations);
    await writeFile("README.md", result.readme);
    await writeFile("CHANGELOG.md", result.changelog);

    console.log("\n✅ Automatic update completed successfully!");
    console.log(`📊 Tokens used: ${response.usage.total_tokens}`);
  } catch (error) {
    console.error("❌ Error generating update:", error.message);
    process.exit(1);
  }
}

generateUpdate();
