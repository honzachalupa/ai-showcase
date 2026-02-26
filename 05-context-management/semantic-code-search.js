class SemanticCodeSearch {
  constructor() {
    this.codebase = [
      {
        file: 'auth/login.js',
        code: `
export async function authenticateUser(username, password) {
  const user = await db.users.findOne({ username });
  if (!user) throw new Error('User not found');
  
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error('Invalid password');
  
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '24h' });
  return { token, user };
}`,
        description: 'User authentication with JWT tokens',
        tags: ['auth', 'jwt', 'login', 'security']
      },
      {
        file: 'auth/register.js',
        code: `
export async function registerUser(username, email, password) {
  const existingUser = await db.users.findOne({ $or: [{ username }, { email }] });
  if (existingUser) throw new Error('User already exists');
  
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.users.create({ username, email, passwordHash });
  
  await sendWelcomeEmail(email);
  return user;
}`,
        description: 'User registration with email verification',
        tags: ['auth', 'register', 'email', 'validation']
      },
      {
        file: 'payments/stripe.js',
        code: `
export async function createPayment(userId, amount, currency) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency,
    customer: userId,
    metadata: { userId }
  });
  
  await db.payments.create({
    userId,
    amount,
    currency,
    stripeId: paymentIntent.id,
    status: 'pending'
  });
  
  return paymentIntent;
}`,
        description: 'Stripe payment processing',
        tags: ['payment', 'stripe', 'transaction', 'money']
      },
      {
        file: 'utils/email.js',
        code: `
export async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  
  await transporter.sendMail({ from: 'noreply@app.com', to, subject, html });
}`,
        description: 'Email sending utility',
        tags: ['email', 'notification', 'smtp']
      },
      {
        file: 'api/users.js',
        code: `
export async function getUserProfile(userId) {
  const user = await db.users.findById(userId);
  if (!user) throw new Error('User not found');
  
  const { passwordHash, ...publicProfile } = user.toObject();
  return publicProfile;
}

export async function updateUserProfile(userId, updates) {
  const allowedFields = ['name', 'bio', 'avatar'];
  const sanitized = Object.keys(updates)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => ({ ...obj, [key]: updates[key] }), {});
  
  return await db.users.findByIdAndUpdate(userId, sanitized, { new: true });
}`,
        description: 'User profile management',
        tags: ['user', 'profile', 'api', 'crud']
      }
    ];

    this.embeddings = this.generateEmbeddings();
  }

  generateEmbeddings() {
    return this.codebase.map(item => ({
      ...item,
      embedding: this.mockEmbedding(item.description + ' ' + item.tags.join(' '))
    }));
  }

  mockEmbedding(text) {
    const words = text.toLowerCase().split(/\s+/);
    const vector = new Array(384).fill(0);
    
    words.forEach((word, i) => {
      const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      vector[hash % 384] += 1;
    });
    
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / (magnitude || 1));
  }

  cosineSimilarity(vec1, vec2) {
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] * vec1[i];
      mag2 += vec2[i] * vec2[i];
    }
    
    return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
  }

  search(query, topK = 3) {
    console.log(`\n🔍 Searching for: "${query}"\n`);
    
    const queryEmbedding = this.mockEmbedding(query);
    
    const results = this.embeddings.map(item => ({
      ...item,
      similarity: this.cosineSimilarity(queryEmbedding, item.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

    console.log('📊 Results:\n');
    results.forEach((result, i) => {
      console.log(`${i + 1}. ${result.file} (similarity: ${(result.similarity * 100).toFixed(1)}%)`);
      console.log(`   ${result.description}`);
      console.log(`   Tags: ${result.tags.join(', ')}\n`);
    });

    return results;
  }

  async searchWithAI(query) {
    console.log('\n🤖 AI-Enhanced Search\n');
    console.log('='.repeat(60));
    
    const results = this.search(query);
    
    console.log('\n💡 Context pro AI:\n');
    const context = results.map(r => `
File: ${r.file}
${r.code}
`).join('\n---\n');
    
    console.log(context);
    
    console.log('\n📝 Prompt pro AI:\n');
    const prompt = `
Based on this code from the codebase:

${context}

User question: ${query}

Please provide a detailed answer with code examples.
`;
    
    console.log(prompt);
    
    return { results, context, prompt };
  }
}

console.log('🚀 Semantic Code Search Demo\n');
console.log('='.repeat(60));

const search = new SemanticCodeSearch();

console.log('💡 Tradiční keyword search vs Semantic search:\n');
console.log('Keyword: Hledá přesné shody slov');
console.log('Semantic: Rozumí významu a kontextu\n');

console.log('='.repeat(60));
console.log('\nDemo 1: Jak se přihlásit?');
await search.searchWithAI('Jak se uživatel přihlásí do aplikace?');

console.log('\n\n' + '='.repeat(60));
console.log('\nDemo 2: Platby');
search.search('Jak zpracovat platbu kreditní kartou?');

console.log('\n' + '='.repeat(60));
console.log('\nDemo 3: Email');
search.search('Poslat email notifikaci');

console.log('\n\n' + '='.repeat(60));
console.log('🎯 Výhody Semantic Search:\n');
console.log('   ✅ Najde relevantní kód i bez přesných keywords');
console.log('   ✅ Rozumí synonymům (login = přihlášení = auth)');
console.log('   ✅ Funguje v jakémkoliv jazyce');
console.log('   ✅ Lepší než grep/regex pro konceptuální hledání');

console.log('\n🛠️  Implementace v praxi:\n');
console.log(`
// 1. Generuj embeddings pro celý codebase
import { openai } from '@ai-sdk/openai';

const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: codeSnippet
});

// 2. Ulož do vector DB
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone();
const index = pinecone.index('codebase');

await index.upsert([{
  id: 'auth/login.js',
  values: embedding.data[0].embedding,
  metadata: { file: 'auth/login.js', code: '...' }
}]);

// 3. Search
const queryEmbedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: 'How to authenticate user?'
});

const results = await index.query({
  vector: queryEmbedding.data[0].embedding,
  topK: 5,
  includeMetadata: true
});

// 4. Použij výsledky jako context pro AI
const context = results.matches.map(m => m.metadata.code).join('\\n');
const answer = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are a code assistant. Use this context: ' + context },
    { role: 'user', content: 'How to authenticate user?' }
  ]
});
`);

console.log('\n📚 Vector Databases:');
console.log('   - Pinecone (managed, easy)');
console.log('   - Chroma (open-source, local)');
console.log('   - Weaviate (open-source, scalable)');
console.log('   - Qdrant (Rust, fast)');
console.log('   - pgvector (PostgreSQL extension)');
