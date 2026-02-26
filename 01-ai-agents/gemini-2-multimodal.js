import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'demo-mode');

async function multimodalCodingDemo() {
  console.log('🎨 Gemini 2.0 Flash - Multimodal Coding Demo\n');
  console.log('='.repeat(60));
  console.log('💡 Gemini 2.0 Flash (prosinec 2025):');
  console.log('   - 2M token context window (největší na trhu)');
  console.log('   - Native vision, audio, video understanding');
  console.log('   - Nejrychlejší multimodální model');
  console.log('   - Zdarma pro developery (s rate limits)\n');

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      }
    });

    // Příklad 1: Screenshot to Code
    console.log('📸 Use Case 1: Screenshot → Code\n');
    
    const screenshotPrompt = `
Analyze this UI screenshot and generate React code with Tailwind CSS.
Include all components, styling, and make it responsive.
`;

    // V reálném použití by zde byl base64 encoded screenshot
    const mockScreenshotAnalysis = `
🔍 Analyzing screenshot...

Detected UI elements:
- Navigation bar (sticky, white background)
- Hero section (gradient background, centered text)
- Feature cards (3 columns, hover effects)
- Footer (dark background, 4 columns)

Generated code:

\`\`\`tsx
import { useState } from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-2xl font-bold text-blue-600">Logo</div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600">Pricing</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Build Amazing Products
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            The fastest way to ship your ideas to production
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Fast', icon: '⚡', desc: 'Lightning fast performance' },
              { title: 'Secure', icon: '🔒', desc: 'Enterprise-grade security' },
              { title: 'Scalable', icon: '📈', desc: 'Grows with your business' }
            ].map((feature) => (
              <div key={feature.title} className="p-6 border rounded-lg hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            {/* More footer columns... */}
          </div>
        </div>
      </footer>
    </div>
  );
}
\`\`\`

✅ Code is production-ready, responsive, and matches screenshot exactly!
`;

    console.log(mockScreenshotAnalysis);

  } catch (error) {
    console.log('ℹ️  Demo mode - nastavte GOOGLE_API_KEY pro live demo');
  }
}

async function videoDebuggingDemo() {
  console.log('\n\n' + '='.repeat(60));
  console.log('🎥 Use Case 2: Video Debugging\n');

  const videoDebugWorkflow = `
Scenario: "Uživatel nahrál video, jak se mu app crashuje"

🎬 Gemini analyzuje video frame by frame:

Frame 1-30 (0-1s):
  - User opens app
  - Loading spinner visible
  - ✅ Normal behavior

Frame 31-60 (1-2s):
  - Data loaded
  - User scrolls to bottom
  - ✅ Smooth scrolling

Frame 61-90 (2-3s):
  - User clicks "Load More" button
  - Button shows loading state
  - ⚠️  Network request initiated

Frame 91-120 (3-4s):
  - Loading spinner stuck
  - UI frozen
  - ❌ App not responding

Frame 121-150 (4-5s):
  - Error modal appears
  - "Network timeout" message
  - ❌ Crash

🔍 Gemini's Analysis:

1. **Root Cause Identified:**
   - Network timeout after 3 seconds
   - No error handling for timeout
   - UI thread blocked during request

2. **Problematic Code:**
   \`\`\`javascript
   const loadMore = async () => {
     setLoading(true);
     const data = await fetch('/api/items'); // No timeout!
     setItems([...items, ...data]);
     setLoading(false);
   };
   \`\`\`

3. **Recommended Fix:**
   \`\`\`javascript
   const loadMore = async () => {
     setLoading(true);
     try {
       const controller = new AbortController();
       const timeoutId = setTimeout(() => controller.abort(), 5000);
       
       const response = await fetch('/api/items', {
         signal: controller.signal
       });
       
       clearTimeout(timeoutId);
       const data = await response.json();
       setItems([...items, ...data]);
     } catch (error) {
       if (error.name === 'AbortError') {
         toast.error('Request timeout - please try again');
       } else {
         toast.error('Failed to load items');
       }
     } finally {
       setLoading(false);
     }
   };
   \`\`\`

4. **Additional Recommendations:**
   - Add retry logic with exponential backoff
   - Show better loading states
   - Implement optimistic UI updates
   - Add offline detection

✅ Bug fixed based on video analysis!
`;

  console.log(videoDebugWorkflow);
}

async function diagramToArchitectureDemo() {
  console.log('\n\n' + '='.repeat(60));
  console.log('📐 Use Case 3: Diagram → Architecture Code\n');

  const diagramAnalysis = `
Input: Hand-drawn architecture diagram (photo)

🔍 Gemini detects:
  - 3 microservices (boxes)
  - Message queue (cylinder)
  - Database (cylinder with lines)
  - API Gateway (cloud shape)
  - Arrows showing data flow

Generated Infrastructure as Code:

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  api-gateway:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - auth-service
      - user-service
      - order-service

  auth-service:
    build: ./services/auth
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/auth
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  user-service:
    build: ./services/user
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/users
      - RABBITMQ_URL=amqp://rabbitmq:5672
    depends_on:
      - db
      - rabbitmq

  order-service:
    build: ./services/order
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/orders
      - RABBITMQ_URL=amqp://rabbitmq:5672
    depends_on:
      - db
      - rabbitmq

  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

volumes:
  postgres_data:
\`\`\`

\`\`\`javascript
// API Gateway routing (nginx.conf equivalent in Node.js)
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api/auth', createProxyMiddleware({ 
  target: 'http://auth-service:3000',
  changeOrigin: true 
}));

app.use('/api/users', createProxyMiddleware({ 
  target: 'http://user-service:3000',
  changeOrigin: true 
}));

app.use('/api/orders', createProxyMiddleware({ 
  target: 'http://order-service:3000',
  changeOrigin: true 
}));

app.listen(80);
\`\`\`

✅ Complete architecture generated from diagram!
`;

  console.log(diagramAnalysis);
}

async function infiniteContextDemo() {
  console.log('\n\n' + '='.repeat(60));
  console.log('♾️  Use Case 4: Infinite Context (2M tokens)\n');

  console.log(`
2M tokens = ~1.5M words = ~6000 pages

Real-world examples:

📚 Entire codebase analysis:
   - Large monorepo (~500k LOC)
   - All files in single prompt
   - Cross-file refactoring
   - Architectural analysis

📖 Full documentation:
   - Complete API docs
   - All tutorials
   - Migration guides
   - Context-aware answers

💬 Long conversations:
   - Weeks of chat history
   - Never loses context
   - Remembers all decisions
   - Consistent recommendations

🔍 Deep code review:
   - Entire PR with history
   - Related issues and discussions
   - Past similar changes
   - Comprehensive feedback

Example prompt:

\`\`\`
Context: [Paste entire 500k LOC codebase]

Task: Refactor authentication system to use OAuth 2.0
- Identify all auth-related code
- Propose migration strategy
- Generate migration scripts
- Update all affected endpoints
- Maintain backward compatibility
\`\`\`

✅ Gemini handles it in single request!
`);
}

async function comparisonTable() {
  console.log('\n\n' + '='.repeat(60));
  console.log('🆚 Gemini 2.0 vs Competition\n');

  console.log(`
| Feature          | Gemini 2.0 Flash | Claude Opus 4 | GPT-4 Turbo |
|------------------|------------------|---------------|-------------|
| Context window   | 2M tokens        | 1M tokens     | 128k tokens |
| Multimodal       | ⭐⭐⭐⭐⭐        | ⭐⭐⭐⭐      | ⭐⭐⭐      |
| Speed            | ⭐⭐⭐⭐⭐        | ⭐⭐⭐        | ⭐⭐⭐⭐    |
| Coding           | ⭐⭐⭐⭐         | ⭐⭐⭐⭐⭐     | ⭐⭐⭐⭐    |
| Cost (free tier) | ✅ Generous      | ❌ No         | ❌ No       |
| Video analysis   | ✅ Native        | ❌ No         | ❌ No       |
| Audio input      | ✅ Native        | ❌ No         | ✅ Yes      |
| Real-time        | ✅ Yes           | ❌ No         | ❌ No       |

💡 Best use cases for Gemini 2.0:
   ✅ Huge codebases (2M context)
   ✅ Visual debugging (screenshots, videos)
   ✅ Diagram to code
   ✅ Cost-sensitive projects (free tier)
   ✅ Real-time applications
   ✅ Multimodal workflows

💡 When to use alternatives:
   - Claude Opus 4: Complex reasoning, computer use
   - GPT-4: Established ecosystem, plugins
   - o3-mini: Deep reasoning, critical bugs
`);
}

async function practicalIntegration() {
  console.log('\n\n' + '='.repeat(60));
  console.log('🔧 Practical Integration Example\n');

  const integrationCode = `
// Visual regression testing with Gemini 2.0

import { GoogleGenerativeAI } from '@google/generative-ai';
import { chromium } from 'playwright';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function visualRegressionTest(url, baselineScreenshot) {
  // Take current screenshot
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const currentScreenshot = await page.screenshot({ fullPage: true });
  await browser.close();

  // Compare with Gemini 2.0
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([
    {
      inlineData: {
        data: baselineScreenshot.toString('base64'),
        mimeType: 'image/png'
      }
    },
    {
      inlineData: {
        data: currentScreenshot.toString('base64'),
        mimeType: 'image/png'
      }
    },
    {
      text: \`Compare these two screenshots and identify any visual differences.
             Report:
             1. Layout changes
             2. Color differences
             3. Missing/added elements
             4. Text changes
             5. Severity (critical/minor)
             
             Format as JSON.\`
    }
  ]);

  const analysis = JSON.parse(result.response.text());
  
  if (analysis.differences.some(d => d.severity === 'critical')) {
    throw new Error(\`Visual regression detected: \${JSON.stringify(analysis)}\`);
  }

  return analysis;
}

// Usage in CI/CD
await visualRegressionTest(
  'https://staging.myapp.com',
  fs.readFileSync('./baseline.png')
);
`;

  console.log(integrationCode);
}

console.log('🚀 Gemini 2.0 Flash - Multimodal AI Demo\n');
console.log('='.repeat(60));

await multimodalCodingDemo();
await videoDebuggingDemo();
await diagramToArchitectureDemo();
await infiniteContextDemo();
await comparisonTable();
await practicalIntegration();

console.log('\n' + '='.repeat(60));
console.log('🎯 Key Takeaways:\n');
console.log('   1. 2M context = entire codebases in one prompt');
console.log('   2. Native multimodal = screenshots, videos, diagrams');
console.log('   3. Fastest model for real-time applications');
console.log('   4. Generous free tier for developers');
console.log('   5. Perfect for visual debugging and testing');
