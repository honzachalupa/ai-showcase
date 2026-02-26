# Quick Start Guide (Únor 2026)

## 🚀 Rychlý start za 5 minut

### 1. Instalace

```bash
# Clone nebo cd do projektu
cd ai-showcase

# Instalace Node.js dependencies
npm install

# (Volitelně) Python dependencies
pip install -r requirements.txt
```

### 2. Spuštění ukázek bez API klíčů

Většina ukázek funguje i bez API klíčů - ukazují koncepty a strukturu:

```bash
# Multi-agent systém (čistý JS, žádné API)
npm run demo:agents

# Chain of Thought pattern
npm run demo:cot

# ReAct pattern
npm run demo:react

# Few-shot prompting
npm run demo:few-shot
```

brew install ollama

# Stáhni model

ollama pull qwen2.5-coder

# Spusť ukázku

npm run demo:ollama

````

### 3. React AI aplikace

```bash
cd 11-react-ai
npm install
npm run dev
# Otevři http://localhost:3000
````

### 4. iOS AI aplikace

# Spusť 2026 demos

npm run demo:o3 # OpenAI o3-mini reasoning
npm run demo:opus4 # Claude Opus 4 computer use
npm run demo:gemini # Gemini 2.0 multimodal

# Nebo všechny najednou

npm run demo:2026

````

## 📚 Co prozkoumat

### Začátečník

1. `01-ai-agents/multi-agent-system.js` - Jak fungují AI agenti
2. `03-prompt-patterns/chain-of-thought.js` - Lepší prompty
3. `06-local-models/ollama-basic.js` - Lokální AI bez nákladů

### Pokročilý

1. `01-ai-agents/openai-structured-outputs.js` - Structured outputs
2. `01-ai-agents/anthropic-tool-calling.js` - Tool calling
3. `07-ai-frameworks/vercel-ai-sdk.js` - Production-ready framework

### Expert

1. `07-ai-frameworks/langgraph-agent.py` - State machines
2. `05-context-management/semantic-code-search.js` - RAG
3. `04-code-review/ai-code-review.js` - Automatizace

## 🎯 Praktické use cases

### "Chci AI code review"

```bash
node 04-code-review/ai-code-review.js
````

### "Chci semantic search v kódu"

```bash
node 05-context-management/semantic-code-search.js
```

### "Chci lokální AI bez nákladů"

```bash
# Nejdřív: ollama pull llama3.1
node 06-local-models/ollama-basic.js
```

### "Chci production-ready řešení"

```bash
node 07-ai-frameworks/vercel-ai-sdk.js
```

## 💡 Tipy

- **Začni s Ollama** - nejrychlejší způsob, jak vyzkoušet AI lokálně
- **Prompt patterns** jsou univerzální - fungují se všemi modely
- **Multi-agent systémy** jsou budoucnost - specializované agenty spolupracují
- **RAG** je klíč pro práci s velkými codebase

## 🆘 Troubleshooting

### "Module not found"

```bash
npm install
```

### "Ollama connection refused"

```bash
ollama serve
```

### "API key invalid"

```bash
# Zkontroluj .env soubor
# Nebo spusť demos bez API klíčů
```

## 📖 Další kroky

1. Přečti si `README.md` pro kompletní přehled
2. Prozkumej jednotlivé složky s ukázkami
3. Zkus upravit kód a experimentuj
4. Integruj do vlastních projektů
