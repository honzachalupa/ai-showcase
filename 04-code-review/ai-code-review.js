const codeToReview = `
// User authentication service
class AuthService {
  constructor(db) {
    this.db = db;
    this.secret = "my-secret-key";
  }

  async login(username, password) {
    const user = await this.db.query(
      "SELECT * FROM users WHERE username = '" + username + "'"
    );
    
    if (user && user.password === password) {
      const token = this.generateToken(user);
      return { success: true, token };
    }
    
    return { success: false };
  }

  generateToken(user) {
    return Buffer.from(JSON.stringify({
      id: user.id,
      username: user.username,
      timestamp: Date.now()
    })).toString('base64');
  }

  async register(req, res) {
    const { username, password } = req.body;
    await this.db.query(
      \`INSERT INTO users (username, password) VALUES ('\${username}', '\${password}')\`
    );
    res.json({ success: true });
  }
}
`;

async function aiCodeReview(code) {
  console.log('🔍 AI Code Review\n');
  console.log('='.repeat(60));
  console.log('Code under review:\n');
  console.log(code);
  console.log('\n' + '='.repeat(60));

  const issues = [
    {
      severity: 'critical',
      category: 'security',
      line: 9,
      issue: 'SQL Injection vulnerability',
      description: 'String concatenation v SQL query umožňuje SQL injection',
      example: "username = \"admin' OR '1'='1\"",
      fix: `
// ❌ Špatně
const user = await this.db.query(
  "SELECT * FROM users WHERE username = '" + username + "'"
);

// ✅ Správně - použij prepared statements
const user = await this.db.query(
  "SELECT * FROM users WHERE username = ?",
  [username]
);

// Nebo s ORM
const user = await this.db.users.findOne({ where: { username } });
`,
      impact: 'Útočník může získat přístup k celé databázi'
    },
    {
      severity: 'critical',
      category: 'security',
      line: 12,
      issue: 'Plaintext password comparison',
      description: 'Hesla jsou uložena a porovnávána v plaintextu',
      fix: `
// ❌ Špatně
if (user.password === password) { ... }

// ✅ Správně - použij bcrypt
import bcrypt from 'bcrypt';

// Při registraci
const hashedPassword = await bcrypt.hash(password, 10);

// Při loginu
const isValid = await bcrypt.compare(password, user.hashedPassword);
if (isValid) { ... }
`,
      impact: 'Pokud dojde k data breach, všechna hesla jsou kompromitována'
    },
    {
      severity: 'critical',
      category: 'security',
      line: 5,
      issue: 'Hardcoded secret key',
      description: 'Secret key je hardcoded v kódu',
      fix: `
// ❌ Špatně
this.secret = "my-secret-key";

// ✅ Správně - použij environment variables
this.secret = process.env.JWT_SECRET;

// A v .env souboru (který je v .gitignore!)
JWT_SECRET=complex-random-secret-generated-by-openssl
`,
      impact: 'Secret key může být ukradený z repository'
    },
    {
      severity: 'critical',
      category: 'security',
      line: 19,
      issue: 'Insecure token generation',
      description: 'Token je pouze base64 encoded JSON, ne kryptograficky podepsaný',
      fix: `
// ❌ Špatně - pouze base64 encoding
return Buffer.from(JSON.stringify(data)).toString('base64');

// ✅ Správně - použij JWT
import jwt from 'jsonwebtoken';

generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}
`,
      impact: 'Útočník může vytvořit vlastní tokeny a vydávat se za kohokoliv'
    },
    {
      severity: 'high',
      category: 'security',
      line: 27,
      issue: 'SQL Injection v registraci',
      description: 'Template literals v SQL query - další SQL injection',
      fix: `
// ❌ Špatně
await this.db.query(
  \\\`INSERT INTO users (username, password) VALUES ('\${username}', '\${password}')\\\`
);

// ✅ Správně
await this.db.query(
  "INSERT INTO users (username, password) VALUES (?, ?)",
  [username, hashedPassword]
);
`,
      impact: 'Útočník může manipulovat s databází'
    },
    {
      severity: 'medium',
      category: 'error-handling',
      line: 8,
      issue: 'Chybějící error handling',
      description: 'Žádné try-catch bloky, chyby nejsou ošetřené',
      fix: `
async login(username, password) {
  try {
    // ... kód
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Authentication failed');
  }
}
`,
      impact: 'Aplikace může crashnout, error messages mohou leaknout citlivé info'
    },
    {
      severity: 'medium',
      category: 'validation',
      line: 26,
      issue: 'Chybějící input validace',
      description: 'Žádná validace username/password před použitím',
      fix: `
async register(req, res) {
  const { username, password } = req.body;
  
  // Validace
  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'Invalid username' });
  }
  
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password too short' });
  }
  
  // ... pokračuj s registrací
}
`,
      impact: 'Možné edge case bugy, špatná UX'
    },
    {
      severity: 'low',
      category: 'best-practices',
      line: 13,
      issue: 'Timing attack vulnerability',
      description: 'Early return při neexistujícím useru odhaluje, zda user existuje',
      fix: `
// ✅ Lepší - constant-time comparison
const user = await this.db.users.findOne({ where: { username } });
const isValidPassword = user 
  ? await bcrypt.compare(password, user.hashedPassword)
  : await bcrypt.compare(password, '$2b$10$dummy.hash.to.prevent.timing');

if (user && isValidPassword) {
  return { success: true, token: this.generateToken(user) };
}

return { success: false, error: 'Invalid credentials' };
`,
      impact: 'Útočník může zjistit, která usernames existují'
    }
  ];

  console.log('\n🚨 Issues Found:\n');

  const bySeverity = {
    critical: issues.filter(i => i.severity === 'critical'),
    high: issues.filter(i => i.severity === 'high'),
    medium: issues.filter(i => i.severity === 'medium'),
    low: issues.filter(i => i.severity === 'low')
  };

  console.log(`❌ Critical: ${bySeverity.critical.length}`);
  console.log(`⚠️  High: ${bySeverity.high.length}`);
  console.log(`⚡ Medium: ${bySeverity.medium.length}`);
  console.log(`💡 Low: ${bySeverity.low.length}`);

  console.log('\n' + '='.repeat(60));
  console.log('\n📋 Detailed Issues:\n');

  issues.forEach((issue, i) => {
    const emoji = {
      critical: '❌',
      high: '⚠️',
      medium: '⚡',
      low: '💡'
    }[issue.severity];

    console.log(`${i + 1}. ${emoji} [${issue.severity.toUpperCase()}] ${issue.issue}`);
    console.log(`   Line: ${issue.line}`);
    console.log(`   Category: ${issue.category}`);
    console.log(`   ${issue.description}`);
    console.log(`   Impact: ${issue.impact}`);
    console.log(`\n   Fix:${issue.fix}`);
    console.log('\n' + '-'.repeat(60) + '\n');
  });

  console.log('📊 Summary:\n');
  console.log('   Total issues: ' + issues.length);
  console.log('   Must fix before production: ' + (bySeverity.critical.length + bySeverity.high.length));
  console.log('   Recommendation: ❌ DO NOT MERGE - critical security issues');

  return issues;
}

async function demonstrateAIReviewTools() {
  console.log('\n\n' + '='.repeat(60));
  console.log('🛠️  AI Code Review Tools\n');

  console.log('1. **GitHub Copilot Workspace**');
  console.log('   - Celé PR reviews s kontextem');
  console.log('   - Navrhuje konkrétní změny');
  console.log('   - Integrované s GitHub\n');

  console.log('2. **Cursor Composer**');
  console.log('   - Multi-file refactoring');
  console.log('   - Vidí celý codebase');
  console.log('   - Aplikuje změny napříč soubory\n');

  console.log('3. **Aider**');
  console.log('   - AI pair programming v terminálu');
  console.log('   - Git-aware (vidí diff)');
  console.log('   - Příkaz: aider --review\n');

  console.log('4. **Custom AI Review (tento příklad)**');
  console.log('   - OpenAI/Claude API');
  console.log('   - Vlastní pravidla a checklist');
  console.log('   - Integrace do CI/CD\n');

  console.log('💡 Best Practices:');
  console.log('   ✅ AI review jako první kolo');
  console.log('   ✅ Human review pro business logic');
  console.log('   ✅ Automatické security scanning');
  console.log('   ✅ AI generuje testy pro nový kód');
  console.log('   ❌ Nespoléhej 100% na AI');
}

await aiCodeReview(codeToReview);
await demonstrateAIReviewTools();

console.log('\n' + '='.repeat(60));
console.log('🎯 Integrace do workflow:\n');
console.log(`
# .github/workflows/ai-review.yml
name: AI Code Review

on: [pull_request]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: AI Code Review
        run: |
          node scripts/ai-review.js
        env:
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
      
      - name: Comment on PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🤖 AI Review completed. Check logs for details.'
            })
`);
