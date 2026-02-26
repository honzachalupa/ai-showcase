# Doporučené AI Modely (Únor 2026)

**Poslední aktualizace:** 26. února 2026

Tento dokument obsahuje aktuální doporučení pro výběr AI modelů podle use case.

## 🏆 Top modely podle kategorie

### Reasoning & Complex Problems

**1. OpenAI o4-mini** (nejnovější, únor 2026)

- Nejnovější reasoning model
- Nejlepší performance na AIME 2024/2025 (99.5% pass@1)
- Optimalizován pro rychlost a cost-efficiency
- Vynikající v math, coding, visual tasks
- Cena: $$

**2. Claude Sonnet 3.7** (únor 2026) ⭐ **NOVÉ**

- Reasoning model ve střední cenové kategorii
- Extended thinking mode (poprvé v non-Opus modelu)
- 200k token context
- 3× rychlejší než Opus 4
- Computer Use API podpora
- Cena: $$

**3. DeepSeek R1** (open-source alternativa)

- Konkuruje o1 za zlomek nákladů
- Transparentní reasoning chain
- Běží lokálně
- Cena: Free

### Coding & Development

**1. GPT-5.3-Codex** (nejlepší, 5. února 2026)

- Nejschopnější agentic coding model
- Kombinuje frontier coding + general reasoning
- Dlouhodobé úlohy s research, tool use, execution
- Interaktivní spolupráce během práce
- Použit při vlastním vývoji
- 25% rychlejší než GPT-5.2-Codex
- Cena: $$$$$

**2. Claude Opus 4** (nejlepší non-agentic)

- 95% accuracy na HumanEval
- 1M token context
- Computer Use API
- Cena: $$$$

**3. GPT-4o** (balanced)

- Rychlejší než GPT-4 Turbo
- Multimodal capabilities
- Dobrá balance mezi cenou a kvalitou
- Cena: $$$

### Multimodal (Vision, Audio, Video)

**1. Gemini 2.5 Pro** (únor 2026) ⭐ **NOVÉ**

- **10M token context window** (rekordní)
- Native video input s pochopením dlouhých videí
- Vylepšený multimodal reasoning
- Grounding v Google Search real-time
- Enterprise SLA
- Cena: $$$

**2. Gemini 2.0 Flash** (stále dostupný)

- 2M token context (největší)
- Native vision, audio, video
- Nejrychlejší multimodal model
- Zdarma pro developery (s limity)
- Cena: $ / Free tier

**3. GPT-4o** (alternativa)

- Dobrý vision support
- Audio input/output
- Cena: $$$

### Chat & Conversational AI

**1. GPT-4o** (balanced)

- Rychlé odpovědi
- Dobrá kvalita
- Streaming support
- Cena: $$$

**2. Claude Sonnet 3.7** (levnější alternativa) ⭐ **NOVÉ**

- Rychlejší než Opus 4
- Extended thinking mode
- Stále velmi dobrá kvalita
- Prompt caching
- Cena: $$

**3. Gemini 2.0 Flash** (nejlevnější)

- Velmi rychlý
- Free tier
- Dobrý pro high-volume aplikace
- Cena: $ / Free

### Local / On-Device

**1. Llama 4** (405B)

- GPT-4 level quality
- Plně open-source
- Quantized verze běží na M3 Mac
- Cena: Free

**2. Qwen 3** (72B)

- Nejlepší open-source coding model
- Multilingual support
- Cena: Free

**3. DeepSeek R1** (reasoning)

- Open-source reasoning
- Běží na consumer hardware
- Cena: Free

## 📊 Srovnávací tabulka

| Use Case              | Nejlepší volba   | Levnější alternativa | Open-source    |
| --------------------- | ---------------- | -------------------- | -------------- |
| **Complex debugging** | o3               | o4-mini              | DeepSeek R1    |
| **Agentic coding**    | GPT-5.3-Codex    | o4-mini              | -              |
| **Coding assistant**  | Claude Opus 4    | Claude Sonnet 3.7    | Qwen 3         |
| **Chatbot**           | GPT-4o           | Claude Sonnet 3.7    | Llama 4        |
| **Multimodal**        | Gemini 2.5 Pro   | Gemini 2.0 Flash     | -              |
| **Large context**     | Gemini 2.5 (10M) | Claude Opus 4 (1M)   | Llama 4 (128k) |
| **Cost-sensitive**    | Gemini 2.0 Flash | Claude Sonnet 3.7    | Llama 4        |

## 💰 Cenové srovnání (přibližné)

| Model                 | Model  | Input (1M tokens) | Output (1M tokens) | Context |
| --------------------- | ------ | ----------------- | ------------------ | ------- |
| **GPT-5.3-Codex**     | $25    | $100              | 128k               |
| **o4-mini**           | $3     | $12               | 128k               |
| **o3**                | $20    | $80               | 128k               |
| **o1**                | $15    | $60               | 128k               |
| **o3-mini**           | $4     | $16               | 128k               |
| **o1-mini**           | $3     | $12               | 128k               |
| **Claude Opus 4**     | $15    | $75               | 1M                 |
| **Claude Sonnet 3.7** ⭐ | $3  | $15               | 200k               |
| **Gemini 2.5 Pro** ⭐  | $7    | $21               | 10M                |
| **GPT-4o**            | $5     | $15               | 128k               |
| **Gemini 2.0 Flash**  | $0.075 | $0.30             | 2M                 |
| **DeepSeek R1**       | Free   | Free              | 64k                |
| **Llama 4**           | Free   | Free              | 128k               |
| **Qwen 3**            | Free   | Free              | 32k                |

## 🎯 Doporučení podle projektu

### Startup / MVP

```javascript
// Primární: Gemini 2.0 Flash (free tier)
model: "gemini-2.0-flash";

// Fallback: GPT-4o (když potřebuješ lepší kvalitu)
model: "gpt-4o";
```

### Enterprise / Production

```javascript
// Coding: Claude Opus 4
model: "claude-opus-4";

// Coding (balanced): Claude Sonnet 3.7 (nové!)
model: "claude-sonnet-3-7";

// Chat: GPT-4o
model: "gpt-4o";

// Reasoning: o4-mini (nebo o3 pro critical tasks)
model: "o4-mini";

// Agentic coding: GPT-5.3-Codex
model: "gpt-5.3-codex";

// Large context / multimodal: Gemini 2.5 Pro (nové!)
model: "gemini-2.5-pro";
```

### Privacy-first / On-premise

```javascript
// Coding: Qwen 3
model: "qwen3:72b";

// General: Llama 4
model: "llama4:405b";

// Reasoning: DeepSeek R1
model: "deepseek-r1:70b";
```

## 🔄 Automatická aktualizace

Tento dokument je automaticky aktualizován každé 2 týdny pomocí GitHub Actions workflow.

**Poslední aktualizace:** 26.2.2026

### ⭐ Novinky v této aktualizaci (únor 2026)
- Přidán **Claude Sonnet 3.7** – reasoning za cenu střední třídy
- Přidán **Gemini 2.5 Pro** – rekordní 10M token context window
- Aktualizovány srovnávací tabulky a doporučení pro projekty

## 📚 Další zdroje

- [OpenAI Model Pricing](https://openai.com/pricing)
- [Anthropic Pricing](https://www.anthropic.com/pricing)
- [Google AI Pricing](https://ai.google.dev/pricing)
- [Ollama Model Library](https://ollama.ai/library)
