async function chainOfThoughtPrompting(problem) {
  console.log("🧠 Chain of Thought Prompting\n");
  console.log("=".repeat(60));
  console.log(`Problem: ${problem}\n`);

  const basicPrompt = `
Vyřeš tento problém: ${problem}
`;

  const cotPrompt = `
Solve this problem step by step. For each step:
1. Explain what you're doing
2. Show the calculation or reasoning
3. Verify that the step is correct

Problem: ${problem}

Postupuj systematicky a ukaž své myšlení.
`;

  console.log("❌ Základní prompt (bez CoT):");
  console.log(basicPrompt);
  console.log("\n📊 Výsledek: Často nesprávný nebo bez vysvětlení\n");

  console.log("✅ Chain of Thought prompt:");
  console.log(cotPrompt);
  console.log("\n📊 Očekávaný výsledek:\n");

  const cotResponse = `
Krok 1: Analýza problému
- Máme funkci, která iteruje přes pole
- Potřebujeme optimalizovat výkon
- Identifikuji bottlenecky

Krok 2: Identifikace problémů
- Používá se for loop místo array methods
- Není žádné cachování
- Chybí early return pro edge cases

Krok 3: Návrh řešení
- Použít Array.reduce() pro čitelnější kód
- Přidat memoizaci pro opakované výpočty
- Přidat validaci na začátku

Krok 4: Implementace
\`\`\`javascript
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const calculateTotal = memoize((items) => {
  if (!Array.isArray(items) || items.length === 0) return 0;
  
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});
\`\`\`

Krok 5: Ověření
- ✅ Memoizace pro opakované volání
- ✅ Validace inputu
- ✅ Čitelnější kód s reduce
- ✅ Funkční programování style
`;

  console.log(cotResponse);

  console.log("\n💡 Výhody CoT:");
  console.log("   - Lepší accuracy (až 3x vyšší)");
  console.log("   - Transparentní reasoning");
  console.log("   - Snadnější debugging");
  console.log("   - Model sám odhalí chyby");

  console.log("\n🎯 Kdy použít:");
  console.log("   ✅ Komplexní problémy");
  console.log("   ✅ Matematické výpočty");
  console.log("   ✅ Code review a refactoring");
  console.log("   ✅ Debugging");
  console.log("   ❌ Jednoduché dotazy");
  console.log("   ❌ Kde nepotřebuješ vysvětlení");
}

async function zeroShotCoT() {
  console.log("\n\n🎯 Zero-Shot CoT (nejnovější trend)\n");
  console.log("=".repeat(60));

  const magicPhrase = "Let's think step by step.";

  console.log("✨ Stačí přidat:");
  console.log(`   "${magicPhrase}"\n`);

  const example = `
Optimalizuj tuto funkci. ${magicPhrase}

\`\`\`javascript
function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}
\`\`\`
`;

  console.log("Prompt:");
  console.log(example);

  console.log("\n📊 Model automaticky:");
  console.log("   1. Analyzuje time complexity (O(n³))");
  console.log("   2. Identifikuje problém (nested loops + includes)");
  console.log("   3. Navrhne Set-based řešení (O(n))");
  console.log("   4. Implementuje optimalizaci");

  console.log("\n💡 Výsledek:");
  console.log(`
\`\`\`javascript
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return Array.from(duplicates);
}
// Time: O(n), Space: O(n)
\`\`\`
`);
}

await chainOfThoughtPrompting(
  "Optimalizuj funkci calculateTotal pro lepší výkon",
);

await zeroShotCoT();
