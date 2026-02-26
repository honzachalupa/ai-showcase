import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'demo-mode'
});

async function computerUseDemo() {
  console.log('🖥️  Claude Opus 4 - Computer Use API Demo\n');
  console.log('='.repeat(60));
  console.log('💡 Computer Use API (prosinec 2025):');
  console.log('   - AI ovládá desktop aplikace');
  console.log('   - Vidí obrazovku, kliká, píše');
  console.log('   - Automatizuje komplexní workflows');
  console.log('   - Debugging v reálném prostředí\n');

  const task = `
Otevři VS Code, vytvoř nový React projekt s TypeScript,
nainstaluj dependencies a spusť dev server.
`;

  try {
    console.log('📝 Task:', task);
    console.log('\n' + '='.repeat(60));
    console.log('🤖 Claude Opus 4 executing...\n');

    const response = await anthropic.messages.create({
      model: "claude-opus-4",
      max_tokens: 4096,
      tools: [
        {
          type: "computer_20241022",
          name: "computer",
          display_width_px: 1920,
          display_height_px: 1080,
          display_number: 1
        },
        {
          type: "text_editor_20241022",
          name: "str_replace_editor"
        },
        {
          type: "bash_20241022",
          name: "bash"
        }
      ],
      messages: [
        {
          role: "user",
          content: task
        }
      ]
    });

    console.log('Actions taken:');
    response.content.forEach((block, i) => {
      if (block.type === 'tool_use') {
        console.log(`\n${i + 1}. ${block.name}:`);
        console.log(JSON.stringify(block.input, null, 2));
      }
    });

  } catch (error) {
    console.log('❌ Computer Use API vyžaduje speciální setup');
    console.log('\n📖 Simulovaný workflow:\n');

    const mockWorkflow = `
🖥️  Action 1: Screenshot
   Taking screenshot to see current state...
   ✅ Desktop visible, no VS Code open

🖱️  Action 2: Click
   Opening Spotlight (Cmd+Space)...
   ✅ Spotlight search opened

⌨️  Action 3: Type
   Typing "Visual Studio Code"...
   ✅ VS Code in results

🖱️  Action 4: Click
   Clicking VS Code...
   ✅ VS Code launched

⌨️  Action 5: Keyboard
   Opening terminal (Ctrl+\`)...
   ✅ Terminal opened

⌨️  Action 6: Type in terminal
   $ npx create-react-app my-app --template typescript
   ✅ Command executed

⏳ Action 7: Wait
   Waiting for installation to complete...
   (monitoring terminal output)
   ✅ Installation complete

⌨️  Action 8: Type in terminal
   $ cd my-app && npm start
   ✅ Dev server starting...

🖥️  Action 9: Screenshot
   Verifying dev server is running...
   ✅ Browser opened on localhost:3000

✅ Task completed successfully!
   React app is running on http://localhost:3000
`;

    console.log(mockWorkflow);
  }
}

async function debuggingWithComputerUse() {
  console.log('\n\n' + '='.repeat(60));
  console.log('🐛 Debugging with Computer Use\n');

  console.log('Scenario: "App crashuje při kliknutí na tlačítko"\n');

  const debugWorkflow = `
🤖 Claude's debugging process:

1. 🖥️  Screenshot
   - Sees the app UI
   - Identifies the problematic button

2. 🖱️  Click button
   - Triggers the crash
   - Observes error in console

3. 📝 Read error
   - "TypeError: Cannot read property 'id' of undefined"
   - Line: Button.tsx:42

4. 🔍 Open file
   - Uses text_editor tool
   - Reads Button.tsx

5. 💡 Analyze code
   \`\`\`typescript
   // Line 42 - problematic code
   const handleClick = () => {
     console.log(user.id); // user might be undefined!
   };
   \`\`\`

6. ✏️  Fix code
   \`\`\`typescript
   const handleClick = () => {
     if (!user) {
       console.error('User not loaded');
       return;
     }
     console.log(user.id);
   };
   \`\`\`

7. 💾 Save file
   - Auto-reload triggered

8. 🖱️  Test again
   - Click button
   - No crash!

9. ✅ Verify fix
   - Screenshot shows working app
   - Console clean

✅ Bug fixed in ~2 minutes, fully autonomous!
`;

  console.log(debugWorkflow);
}

async function realWorldUseCases() {
  console.log('\n\n' + '='.repeat(60));
  console.log('🎯 Real-World Use Cases\n');

  console.log(`
1. **E2E Testing Automation**
   \`\`\`javascript
   "Test complete user registration flow:
    1. Fill form
    2. Submit
    3. Verify email sent
    4. Click confirmation link
    5. Verify account activated"
   \`\`\`
   → AI performs all steps, reports results

2. **Visual Regression Testing**
   \`\`\`javascript
   "Compare current homepage with baseline screenshot,
    identify any visual differences"
   \`\`\`
   → AI spots layout shifts, color changes

3. **Performance Profiling**
   \`\`\`javascript
   "Open Chrome DevTools, record performance,
    interact with app, analyze bottlenecks"
   \`\`\`
   → AI identifies slow components

4. **Cross-browser Testing**
   \`\`\`javascript
   "Test checkout flow in Chrome, Firefox, Safari,
    report any inconsistencies"
   \`\`\`
   → AI tests all browsers autonomously

5. **Accessibility Audit**
   \`\`\`javascript
   "Navigate app using only keyboard,
    identify any inaccessible elements"
   \`\`\`
   → AI finds a11y issues

6. **Data Entry Automation**
   \`\`\`javascript
   "Fill out 100 test user profiles
    with realistic data"
   \`\`\`
   → AI automates tedious tasks
`);
}

async function setupInstructions() {
  console.log('\n\n' + '='.repeat(60));
  console.log('⚙️  Setup Instructions\n');

  console.log(`
Computer Use API requires special environment:

1. **Docker Container** (recommended)
   \`\`\`bash
   docker run -it \\
     -e ANTHROPIC_API_KEY=\${ANTHROPIC_API_KEY} \\
     -v $(pwd):/workspace \\
     anthropic/computer-use:latest
   \`\`\`

2. **Local Setup**
   - Install VNC server
   - Configure screen resolution
   - Set up input simulation
   - Run Claude with computer tool

3. **Security Considerations**
   ⚠️  AI has full computer access!
   - Run in sandboxed environment
   - Don't use on production machines
   - Monitor all actions
   - Set strict permissions

4. **Cost**
   - Computer use is expensive
   - ~$0.50 per minute of interaction
   - Use for high-value automation only

📚 Documentation:
   https://docs.anthropic.com/claude/docs/computer-use
`);
}

async function comparisonWithTraditionalAutomation() {
  console.log('\n\n' + '='.repeat(60));
  console.log('🆚 Computer Use vs Traditional Automation\n');

  console.log(`
| Aspect           | Selenium/Playwright | Computer Use API    |
|------------------|---------------------|---------------------|
| Setup            | Write selectors     | Natural language    |
| Maintenance      | Breaks on changes   | Adapts automatically|
| Flexibility      | Scripted paths      | Handles unexpected  |
| Visual testing   | Limited             | Native              |
| Cross-app        | Web only            | Any desktop app     |
| Learning curve   | High                | Low                 |
| Cost             | Free                | $$$                 |
| Speed            | Fast                | Slower              |
| Reliability      | High (if stable)    | Good (improving)    |

💡 Best approach: Hybrid
   - Selenium for stable, repetitive tests
   - Computer Use for exploratory, visual, cross-app tasks
`);
}

console.log('🚀 Claude Opus 4 - Computer Use API\n');
console.log('='.repeat(60));

await computerUseDemo();
await debuggingWithComputerUse();
await realWorldUseCases();
await setupInstructions();
await comparisonWithTraditionalAutomation();

console.log('\n' + '='.repeat(60));
console.log('🎯 Key Takeaways:\n');
console.log('   1. AI can now control your computer');
console.log('   2. Perfect for visual testing and debugging');
console.log('   3. Automates complex multi-app workflows');
console.log('   4. Use in sandboxed environment only');
console.log('   5. Expensive but powerful for right use cases');
