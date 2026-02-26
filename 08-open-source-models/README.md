# Open-Source Coding Models (2026)

## Proč open-source?

**Výhody:**
- ✅ Žádné API náklady
- ✅ Plná kontrola nad daty
- ✅ Offline development
- ✅ Customizace a fine-tuning
- ✅ Žádné rate limity

## Klíčové modely 2026

### 1. **OpenCode** (2025)
- Open-source alternativa k GitHub Copilot
- Integruje se do VS Code, JetBrains
- Běží lokálně nebo self-hosted
- Podporuje 50+ jazyků
- Community-driven development

### 2. **StarCoder 2** (15B parametrů)
- Trénovaný na The Stack v2 (600+ jazyků)
- Fill-in-the-middle capability
- Lepší než původní StarCoder o 30%
- Optimalizovaný pro code completion
- Apache 2.0 license

### 3. **CodeGemma** (Google, 2025)
- 7B parametrů, odvozený od Gemma
- Specializovaný na coding tasks
- Rychlá inference
- Dobrý pro embedded devices
- Open weights

### 4. **WizardCoder** (34B parametrů)
- Fine-tuned Llama 3 pro coding
- Evol-Instruct metodologie
- Konkuruje GPT-4 na HumanEval
- Vynikající pro complex reasoning
- Dostupný přes Ollama

### 5. **Phind CodeLlama** (34B)
- Optimalizovaný pro search + code
- Trénovaný na high-quality code
- Rychlejší než base CodeLlama
- Dobrý pro debugging
- Self-hosted friendly

## Srovnání výkonu

| Model | HumanEval | MBPP | Rychlost | Paměť | License |
|-------|-----------|------|----------|-------|---------|
| OpenCode | 72% | 68% | ⭐⭐⭐⭐ | 8GB | MIT |
| StarCoder 2 | 75% | 71% | ⭐⭐⭐⭐ | 16GB | Apache 2.0 |
| CodeGemma | 68% | 65% | ⭐⭐⭐⭐⭐ | 6GB | Gemma License |
| WizardCoder | 81% | 76% | ⭐⭐⭐ | 32GB | Llama 3 |
| Phind CodeLlama | 78% | 74% | ⭐⭐⭐ | 32GB | Llama 2 |
| GPT-4 (reference) | 88% | 82% | ⭐⭐⭐⭐ | Cloud | Proprietary |

## Ukázky

1. **opencode-vscode.js** - OpenCode integrace do VS Code
2. **starcoder2-completion.js** - Code completion s StarCoder 2
3. **codegemma-embedded.js** - CodeGemma na edge devices
4. **wizardcoder-refactoring.js** - Complex refactoring
5. **self-hosted-setup.md** - Jak si nastavit vlastní coding AI

## Kdy použít open-source?

✅ **Ano:**
- Citlivá data (finance, healthcare)
- Offline development
- Cost-sensitive projekty
- Customizace na specifický domain
- Learning a experimentování

❌ **Ne (použij cloud API):**
- Potřebuješ nejlepší accuracy
- Nemáš GPU hardware
- Quick prototyping
- Malý tým bez DevOps
