# Git Setup & Automatická Aktualizace (každé 2 týdny)

## 🚀 Nastavení Git Repository

### 1. Inicializace Git repo

```bash
# Inicializuj Git (pokud ještě není)
git init

# Přidej všechny soubory
git add .

# První commit
git commit -m "🎉 Initial commit - AI Showcase 2024-2026"
```

### 2. Vytvoř GitHub repository

```bash
# Vytvoř repo na GitHubu (https://github.com/new)
# Název: ai-showcase
# Description: Kompletní přehled AI development trendů 2024-2026

# Propoj s remote
git remote add origin https://github.com/TVOJE_USERNAME/ai-showcase.git

# Push
git branch -M main
git push -u origin main
```

### 3. Nastav GitHub Secrets

Pro automatickou aktualizaci potřebuješ nastavit API klíč:

1. Jdi na GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Klikni **New repository secret**
3. Název: `OPENAI_API_KEY`
4. Hodnota: Tvůj OpenAI API klíč
5. Klikni **Add secret**

## 🤖 Automatická Aktualizace (každé 2 týdny)

### Jak to funguje?

Projekt obsahuje GitHub Actions workflow (`.github/workflows/automatic-update.yml`), který:

1. **Spustí se automaticky** každé 2 týdny (1. a 15. den měsíce) v 9:00 UTC
2. **Dotáže AI** (GPT-5.3-Codex - nejnovější a nejschopnější model, 5.2.2026) na nejnovější trendy za poslední 2 týdny
3. **Aktualizuje soubory:**
   - `TRENDS.md` - přidá novou sekci s měsíčními trendy
   - `README.md` - aktualizuje datum
   - `CHANGELOG.md` - přidá changelog entry
4. **Vytvoří Pull Request** s popisem změn
5. **Ty jen zkontroluj a merge** PR

### Manuální spuštění

Můžeš spustit aktualizaci i manuálně:

1. Jdi na GitHub repo → **Actions**
2. Vyber workflow **Automatic AI Trends Update**
3. Klikni **Run workflow**
4. Vyber branch (main)
5. Klikni **Run workflow**

### Co se aktualizuje?

Script `scripts/generate-monthly-update.js` automaticky:

✅ **Detekuje nové modely:**

- GPT-5, Claude Opus 5, Gemini 3.0, atd.
- Open-source modely (Llama, Qwen, atd.)

✅ **Sleduje nové frameworky:**

- Vercel AI SDK updates
- LangGraph Cloud features
- Nové AI coding assistants

✅ **Identifikuje průlomy:**

- Reasoning capabilities
- Context window increases
- Multimodal improvements
- Computer use enhancements

✅ **Aktualizuje benchmarky:**

- HumanEval scores
- SWE-bench results
- Model comparisons

### Customizace

Můžeš upravit:

**Frekvenci aktualizací** (`.github/workflows/monthly-update.yml`):

```yaml
on:
  schedule:
    # Týdně (každou neděli)
    - cron: "0 9 * * 0"

    # Dvakrát měsíčně (1. a 15. den)
    - cron: "0 9 1,15 * *"
```

**Prompt pro AI** (`scripts/generate-monthly-update.js`):

```javascript
const prompt = `Tvůj custom prompt...`;
```

**Model** (`scripts/generate-automatic-update.js`):

```javascript
model: 'gpt-5.3-codex',  // Nejnovější a nejschopnější (5.2.2026)
// Alternativy:
// 'o4-mini' - rychlejší, levnější reasoning
// 'o3' - nejsilnější reasoning (dražší)
// 'claude-opus-4' - nejlepší pro non-agentic coding
// 'gemini-2.0-flash' - největší context (2M tokens)
```

## 📊 Monitoring

### Sleduj aktualizace

1. **GitHub Actions tab** - vidíš historii všech runů
2. **Pull Requests** - každá aktualizace vytvoří PR
3. **CHANGELOG.md** - chronologický přehled změn

### Notifikace

Nastav GitHub notifikace:

1. **Settings** → **Notifications**
2. Zapni **Actions** notifications
3. Dostaneš email při každé aktualizaci

## 🔧 Troubleshooting

### Workflow selhal?

1. Zkontroluj **Actions** tab pro error log
2. Ověř že `OPENAI_API_KEY` je správně nastavený
3. Zkontroluj rate limits na OpenAI API

### PR se nevytvořil?

- Možná nebyly žádné změny (AI nenašla nové trendy)
- Zkontroluj permissions v **Settings** → **Actions** → **General**
- Zapni **Allow GitHub Actions to create and approve pull requests**

### Chci upravit vygenerovaný obsah?

1. Otevři PR vytvořený workflow
2. Checkout branch lokálně
3. Uprav soubory
4. Commit & push
5. Merge PR

## 🎯 Best Practices

### ✅ Do

- **Review každý PR** před merge
- **Testuj lokálně** script před push: `node scripts/generate-monthly-update.js`
- **Backup** důležitých custom změn
- **Dokumentuj** vlastní úpravy v CHANGELOG

### ❌ Don't

- Needituj přímo `main` branch - vždy přes PR
- Nesdílej API klíče v kódu
- Nemerge PR bez review
- Nemazej workflow history

## 📚 Další kroky

1. **Star repo** pro snadné nalezení
2. **Watch repo** pro notifikace
3. **Fork** pokud chceš vlastní verzi
4. **Contribute** - pull requesty vítány!

## 🤝 Contributing

Pokud najdeš nový trend nebo chceš přidat ukázku:

1. Fork repo
2. Vytvoř feature branch (`git checkout -b feature/new-trend`)
3. Commit změny (`git commit -m 'Add new trend'`)
4. Push branch (`git push origin feature/new-trend`)
5. Otevři Pull Request

---

**Automatická aktualizace = Vždy aktuální přehled AI trendů! 🚀**
