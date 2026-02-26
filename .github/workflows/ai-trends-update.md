---
on:
  schedule:
    - cron: "0 9 1,15 * *" # Každé 2 týdny (1. a 15. den měsíce)
  workflow_dispatch:

permissions:
  pull-requests: read
  issues: read
  contents: read

safe-outputs:
  create-pull-request:
    title-prefix: "🤖 AI Trends Update - "
    labels: [automated, ai-trends]

tools:
  github:
  web-search:
---

# AI Trends Automatic Update

You are an AI expert tracking the latest trends in AI-assisted software development.

## Task

Analyze the latest AI development trends from the past 2 weeks and update the repository documentation.

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
- Create a comprehensive pull request description summarizing all changes

## Quality Checks

- Verify all information is accurate and from reliable sources
- Ensure no duplicate content
- Check that all markdown links work
- Maintain consistent formatting throughout
- Only include trends from the last 2 weeks
