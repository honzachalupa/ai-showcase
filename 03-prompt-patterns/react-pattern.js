class ReActAgent {
  constructor() {
    this.tools = {
      search_code: this.searchCode.bind(this),
      run_tests: this.runTests.bind(this),
      analyze_error: this.analyzeError.bind(this),
      apply_fix: this.applyFix.bind(this)
    };
    this.maxIterations = 5;
  }

  searchCode(query) {
    console.log(`   🔍 Searching code for: "${query}"`);
    return {
      files: ['src/auth.js', 'src/utils/validation.js'],
      matches: [
        { file: 'src/auth.js', line: 42, code: 'if (user.password === password)' }
      ]
    };
  }

  runTests(testFile) {
    console.log(`   🧪 Running tests: ${testFile}`);
    return {
      passed: 8,
      failed: 2,
      errors: [
        { test: 'should hash password', error: 'Password stored in plaintext' },
        { test: 'should validate token', error: 'Token validation missing' }
      ]
    };
  }

  analyzeError(error) {
    console.log(`   🔬 Analyzing error: ${error}`);
    return {
      root_cause: 'Password comparison without hashing',
      severity: 'critical',
      affected_files: ['src/auth.js']
    };
  }

  applyFix(file, fix) {
    console.log(`   🔧 Applying fix to: ${file}`);
    return {
      success: true,
      changes: fix
    };
  }

  async solve(problem) {
    console.log('🤖 ReAct Pattern: Reasoning + Acting\n');
    console.log('='.repeat(60));
    console.log(`Problem: ${problem}\n`);

    let iteration = 0;
    let solved = false;
    const history = [];

    while (!solved && iteration < this.maxIterations) {
      iteration++;
      console.log(`\n--- Iteration ${iteration} ---\n`);

      const thought = this.think(problem, history);
      console.log(`💭 Thought: ${thought.reasoning}`);

      const action = this.act(thought);
      console.log(`⚡ Action: ${action.tool}(${JSON.stringify(action.input)})`);

      const observation = this.tools[action.tool](action.input);
      console.log(`👁️  Observation:`, JSON.stringify(observation, null, 2));

      history.push({ thought, action, observation });

      solved = this.isSolved(observation, problem);
      
      if (solved) {
        console.log(`\n✅ Problem solved in ${iteration} iterations!`);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return this.summarize(history);
  }

  think(problem, history) {
    if (history.length === 0) {
      return {
        reasoning: 'Začnu tím, že najdu relevantní kód pro authentication',
        next_action: 'search_code'
      };
    }

    const lastObs = history[history.length - 1].observation;

    if (lastObs.matches) {
      return {
        reasoning: 'Našel jsem problém - heslo se porovnává bez hashování. Spustím testy.',
        next_action: 'run_tests'
      };
    }

    if (lastObs.errors) {
      return {
        reasoning: 'Testy selhaly kvůli plaintext heslu. Analyzuji root cause.',
        next_action: 'analyze_error'
      };
    }

    if (lastObs.root_cause) {
      return {
        reasoning: 'Vím, co je špatně. Aplikuji fix - použiji bcrypt pro hashing.',
        next_action: 'apply_fix'
      };
    }

    return {
      reasoning: 'Fix aplikován, problém vyřešen.',
      next_action: 'done'
    };
  }

  act(thought) {
    const actions = {
      'search_code': { tool: 'search_code', input: 'password comparison' },
      'run_tests': { tool: 'run_tests', input: 'auth.test.js' },
      'analyze_error': { tool: 'analyze_error', input: 'Password stored in plaintext' },
      'apply_fix': {
        tool: 'apply_fix',
        input: {
          file: 'src/auth.js',
          fix: `
import bcrypt from 'bcrypt';

// Before
if (user.password === password) { ... }

// After
const isValid = await bcrypt.compare(password, user.hashedPassword);
if (isValid) { ... }
`
        }
      }
    };

    return actions[thought.next_action] || { tool: 'done', input: null };
  }

  isSolved(observation, problem) {
    return observation.success === true;
  }

  summarize(history) {
    console.log('\n\n📋 Summary\n');
    console.log('='.repeat(60));
    
    console.log('\n🔄 ReAct Loop:');
    history.forEach((step, i) => {
      console.log(`\n${i + 1}. Thought → Action → Observation`);
      console.log(`   💭 ${step.thought.reasoning}`);
      console.log(`   ⚡ ${step.action.tool}`);
      console.log(`   👁️  ${Object.keys(step.observation).join(', ')}`);
    });

    console.log('\n\n💡 Proč ReAct funguje:');
    console.log('   - Kombinuje reasoning (myšlení) s acting (akce)');
    console.log('   - Iterativní přístup - učí se z observací');
    console.log('   - Transparentní - vidíš každý krok');
    console.log('   - Samo-korektivní - může změnit strategii');

    console.log('\n🎯 Použití v praxi:');
    console.log('   ✅ Debugging komplexních problémů');
    console.log('   ✅ Code refactoring s testy');
    console.log('   ✅ Security audits');
    console.log('   ✅ Automatické opravy bugů');

    return {
      iterations: history.length,
      solved: true,
      steps: history
    };
  }
}

const agent = new ReActAgent();
await agent.solve('Fix security vulnerability in authentication');

console.log('\n\n🆚 ReAct vs. Chain of Thought\n');
console.log('='.repeat(60));
console.log(`
| Aspect          | Chain of Thought      | ReAct                    |
|-----------------|-----------------------|--------------------------|
| Approach        | Pure reasoning        | Reasoning + Actions      |
| Tools           | No                    | Yes                      |
| Iterations      | Single pass           | Multiple iterations      |
| Feedback        | No                    | Yes (observations)       |
| Best for        | Math, logic           | Real-world tasks         |
| Self-correction | Limited               | Strong                   |
`);
