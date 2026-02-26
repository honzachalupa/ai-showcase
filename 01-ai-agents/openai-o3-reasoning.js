import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-mode'
});

async function o3ReasoningDemo() {
  console.log('🧠 OpenAI o3-mini - Deep Reasoning Demo\n');
  console.log('='.repeat(60));
  console.log('💡 Co je nového v o3-mini (leden 2026):');
  console.log('   - Deep thinking před odpovědí (až 60s reasoning)');
  console.log('   - Viditelný reasoning process');
  console.log('   - 88% accuracy na SWE-bench');
  console.log('   - 3x rychlejší než o1');
  console.log('   - Levnější než GPT-4\n');

  const complexProblem = `
Máme tento buggy kód:

\`\`\`javascript
class Cache {
  constructor(maxSize = 100) {
    this.cache = {};
    this.maxSize = maxSize;
  }

  set(key, value) {
    if (Object.keys(this.cache).length >= this.maxSize) {
      const firstKey = Object.keys(this.cache)[0];
      delete this.cache[firstKey];
    }
    this.cache[key] = value;
  }

  get(key) {
    return this.cache[key];
  }
}
\`\`\`

Problémy:
1. Cache roste nad maxSize
2. Není LRU eviction
3. Performance issues s Object.keys()
4. Chybí TTL support

Navrhni optimální řešení s vysvětlením reasoning procesu.
`;

  try {
    console.log('📝 Problem:');
    console.log(complexProblem);
    console.log('\n' + '='.repeat(60));
    console.log('🤔 o3-mini thinking...\n');

    const response = await openai.chat.completions.create({
      model: "o3-mini",
      messages: [
        {
          role: "user",
          content: complexProblem
        }
      ],
      reasoning_effort: "high", // low, medium, high
      stream: true
    });

    let reasoningSteps = [];
    let finalAnswer = '';

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content;
      const reasoning = chunk.choices[0]?.delta?.reasoning;

      if (reasoning) {
        reasoningSteps.push(reasoning);
        console.log(`💭 Reasoning: ${reasoning}`);
      }

      if (content) {
        finalAnswer += content;
        process.stdout.write(content);
      }
    }

    console.log('\n\n' + '='.repeat(60));
    console.log('📊 Reasoning Summary:\n');
    console.log(`Total reasoning steps: ${reasoningSteps.length}`);
    console.log('Reasoning process:');
    reasoningSteps.slice(0, 5).forEach((step, i) => {
      console.log(`  ${i + 1}. ${step.substring(0, 100)}...`);
    });

  } catch (error) {
    console.log('❌ o3-mini není dostupný nebo chybí API klíč');
    console.log('\n📖 Očekávaný reasoning process:\n');
    
    const mockReasoning = `
💭 Step 1: Analyzing the problem
   - Cache implementation has multiple issues
   - Need to identify root causes systematically

💭 Step 2: Issue #1 - Size management
   - Object.keys() is called AFTER checking size
   - This means cache can grow to maxSize + 1
   - Need to check BEFORE adding

💭 Step 3: Issue #2 - Not LRU
   - Deleting first key != least recently used
   - Need to track access order
   - Map maintains insertion order, but not access order

💭 Step 4: Issue #3 - Performance
   - Object.keys() is O(n) operation
   - Called on every set()
   - Should use Map for O(1) operations

💭 Step 5: Issue #4 - No TTL
   - No expiration mechanism
   - Stale data can persist
   - Need timestamp tracking

💭 Step 6: Designing solution
   - Use Map for O(1) operations
   - Track access order for LRU
   - Add TTL with timestamps
   - Implement proper size management

💭 Step 7: Implementation strategy
   - Map for storage
   - Separate Map for TTL tracking
   - Move accessed items to end (delete + set)
   - Check TTL on get()

✅ Final solution:

\`\`\`javascript
class LRUCache {
  constructor(maxSize = 100, ttl = null) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl; // milliseconds
    this.timestamps = new Map();
  }

  set(key, value) {
    // Remove if exists (for LRU reordering)
    if (this.cache.has(key)) {
      this.cache.delete(key);
      this.timestamps.delete(key);
    }

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.timestamps.delete(firstKey);
    }

    // Add new entry (at end = most recent)
    this.cache.set(key, value);
    if (this.ttl) {
      this.timestamps.set(key, Date.now());
    }
  }

  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // Check TTL
    if (this.ttl) {
      const timestamp = this.timestamps.get(key);
      if (Date.now() - timestamp > this.ttl) {
        this.cache.delete(key);
        this.timestamps.delete(key);
        return undefined;
      }
    }

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  get size() {
    return this.cache.size;
  }
}

// Tests
const cache = new LRUCache(3, 5000); // max 3 items, 5s TTL

cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);
console.log(cache.size); // 3

cache.set('d', 4); // Evicts 'a' (oldest)
console.log(cache.has('a')); // false
console.log(cache.has('b')); // true

cache.get('b'); // Access 'b' (moves to end)
cache.set('e', 5); // Evicts 'c' (now oldest)
console.log(cache.has('c')); // false
console.log(cache.has('b')); // true (was accessed)

// TTL test
setTimeout(() => {
  console.log(cache.get('d')); // undefined (expired)
}, 6000);
\`\`\`

🎯 Why this solution is optimal:

1. **LRU Eviction**: Map maintains insertion order, delete+set moves to end
2. **O(1) Operations**: Map.get/set/delete are all O(1)
3. **Proper Size Management**: Check BEFORE adding, not after
4. **TTL Support**: Optional expiration with timestamp tracking
5. **Memory Efficient**: Only stores what's needed
6. **Type Safe**: Can add TypeScript types easily

📊 Complexity Analysis:
- set(): O(1) - constant time operations
- get(): O(1) - constant time operations
- Space: O(n) where n = maxSize

🔒 Thread Safety Note:
For concurrent access, wrap operations in locks or use atomic operations.
`;

    console.log(mockReasoning);
  }
}

async function compareWithGPT4() {
  console.log('\n\n' + '='.repeat(60));
  console.log('🆚 o3-mini vs GPT-4 Turbo\n');

  console.log(`
| Aspect              | GPT-4 Turbo         | o3-mini              |
|---------------------|---------------------|----------------------|
| Response time       | 2-5s                | 10-60s (thinking)    |
| Reasoning visible   | ❌ No               | ✅ Yes               |
| Complex problems    | Good                | Excellent            |
| Code accuracy       | 85%                 | 95%                  |
| Self-correction     | Limited             | Strong               |
| Cost                | $$                  | $$$                  |
| Best for            | General tasks       | Complex debugging    |

💡 Kdy použít o3-mini:
   ✅ Komplexní debugging
   ✅ Architectural decisions
   ✅ Performance optimization
   ✅ Security analysis
   ✅ Kdy potřebuješ vidět reasoning

💡 Kdy použít GPT-4:
   ✅ Rychlé odpovědi
   ✅ Jednoduché úlohy
   ✅ Cost-sensitive aplikace
   ✅ Real-time interactions
`);
}

async function reasoningEffortLevels() {
  console.log('\n' + '='.repeat(60));
  console.log('⚙️  Reasoning Effort Levels\n');

  console.log(`
reasoning_effort: "low"
├─ Thinking time: ~5s
├─ Cost: $
├─ Use case: Simple bugs, quick fixes
└─ Accuracy: 85%

reasoning_effort: "medium" (default)
├─ Thinking time: ~15s
├─ Cost: $$
├─ Use case: Standard debugging, refactoring
└─ Accuracy: 92%

reasoning_effort: "high"
├─ Thinking time: ~60s
├─ Cost: $$$
├─ Use case: Complex architecture, security
└─ Accuracy: 95%

💡 Tip: Start with "low", escalate if needed
`);
}

console.log('🚀 OpenAI o3-mini - Reasoning Model Demo\n');
console.log('='.repeat(60));

await o3ReasoningDemo();
await compareWithGPT4();
await reasoningEffortLevels();

console.log('\n' + '='.repeat(60));
console.log('🎯 Key Takeaways:\n');
console.log('   1. o3-mini shows its thinking process');
console.log('   2. Better accuracy on complex problems');
console.log('   3. Self-correcting during reasoning');
console.log('   4. Worth the wait for critical code');
console.log('   5. Use reasoning_effort to control cost/quality');
