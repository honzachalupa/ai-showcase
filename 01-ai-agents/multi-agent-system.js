class Agent {
  constructor(name, role, expertise) {
    this.name = name;
    this.role = role;
    this.expertise = expertise;
  }

  async process(task, context = {}) {
    console.log(`\n👤 ${this.name} (${this.role}):`);
    console.log(`   Task: ${task}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.generateResponse(task, context);
  }

  generateResponse(task, context) {
    throw new Error('Must implement generateResponse');
  }
}

class ArchitectAgent extends Agent {
  constructor() {
    super('Alice', 'Software Architect', ['system design', 'patterns', 'scalability']);
  }

  generateResponse(task) {
    if (task.includes('design') || task.includes('architecture')) {
      return {
        agent: this.name,
        decision: 'microservices',
        reasoning: 'Pro škálovatelnost a nezávislý deployment',
        components: [
          { name: 'API Gateway', tech: 'Kong/Nginx' },
          { name: 'Auth Service', tech: 'Node.js + JWT' },
          { name: 'User Service', tech: 'Node.js + PostgreSQL' },
          { name: 'Message Queue', tech: 'RabbitMQ' }
        ],
        nextSteps: ['Definovat API kontrakty', 'Setup infrastructure']
      };
    }
    return { agent: this.name, response: 'Potřebuji více detailů o požadavcích' };
  }
}

class DeveloperAgent extends Agent {
  constructor() {
    super('Bob', 'Senior Developer', ['coding', 'testing', 'optimization']);
  }

  generateResponse(task, context) {
    if (context.components) {
      return {
        agent: this.name,
        implementation: {
          'API Gateway': {
            code: `
// Kong configuration
services:
  - name: auth-service
    url: http://auth:3000
    routes:
      - paths: [/api/auth]
`,
            tests: 'Integration tests s Postman/Newman',
            estimated_time: '2 days'
          },
          'Auth Service': {
            code: `
// JWT authentication middleware
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
`,
            tests: 'Unit tests s Jest, E2E s Playwright',
            estimated_time: '3 days'
          }
        },
        nextSteps: ['Code review', 'Security audit']
      };
    }
    return { agent: this.name, response: 'Potřebuji architectural design' };
  }
}

class QAAgent extends Agent {
  constructor() {
    super('Charlie', 'QA Engineer', ['testing', 'automation', 'security']);
  }

  generateResponse(task, context) {
    if (context.implementation) {
      return {
        agent: this.name,
        testPlan: {
          unit_tests: {
            coverage_target: '80%',
            framework: 'Jest',
            critical_paths: ['Authentication', 'Authorization', 'Token refresh']
          },
          integration_tests: {
            framework: 'Supertest',
            scenarios: [
              'User registration flow',
              'Login with valid credentials',
              'Login with invalid credentials',
              'Token expiration handling'
            ]
          },
          e2e_tests: {
            framework: 'Playwright',
            scenarios: [
              'Complete user journey',
              'Error handling',
              'Performance under load'
            ]
          },
          security_tests: {
            checks: [
              'SQL injection prevention',
              'XSS protection',
              'CSRF tokens',
              'Rate limiting',
              'Password hashing (bcrypt)'
            ]
          }
        },
        issues_found: [
          {
            severity: 'high',
            description: 'JWT secret by měl být v environment variables',
            location: 'auth.js:15'
          }
        ],
        estimated_time: '4 days'
      };
    }
    return { agent: this.name, response: 'Potřebuji implementaci k otestování' };
  }
}

class DevOpsAgent extends Agent {
  constructor() {
    super('Diana', 'DevOps Engineer', ['CI/CD', 'infrastructure', 'monitoring']);
  }

  generateResponse(task, context) {
    return {
      agent: this.name,
      infrastructure: {
        containerization: {
          tool: 'Docker',
          files: ['Dockerfile', 'docker-compose.yml']
        },
        ci_cd: {
          platform: 'GitHub Actions',
          pipeline: [
            'Lint & Format check',
            'Run unit tests',
            'Run integration tests',
            'Build Docker image',
            'Security scan (Snyk)',
            'Deploy to staging',
            'Run E2E tests',
            'Deploy to production (manual approval)'
          ]
        },
        monitoring: {
          logs: 'ELK Stack (Elasticsearch, Logstash, Kibana)',
          metrics: 'Prometheus + Grafana',
          alerts: 'PagerDuty',
          apm: 'New Relic / DataDog'
        }
      },
      estimated_time: '3 days'
    };
  }
}

class Orchestrator {
  constructor() {
    this.agents = [
      new ArchitectAgent(),
      new DeveloperAgent(),
      new QAAgent(),
      new DevOpsAgent()
    ];
  }

  async executeProject(projectDescription) {
    console.log('🎯 Project:', projectDescription);
    console.log('='.repeat(60));

    const context = {};

    for (const agent of this.agents) {
      const result = await agent.process(projectDescription, context);
      
      console.log('   Result:', JSON.stringify(result, null, 2));
      
      Object.assign(context, result);
    }

    return context;
  }
}

console.log('🚀 Multi-Agent System Demo\n');
console.log('='.repeat(60));
console.log('📖 Tento příklad ukazuje:');
console.log('   - Specializované AI agenty pro různé role');
console.log('   - Předávání kontextu mezi agenty');
console.log('   - Orchestrace komplexního workflow');
console.log('   - Simulace real-world development procesu\n');

const orchestrator = new Orchestrator();
const result = await orchestrator.executeProject(
  'Vytvoř authentication microservice s JWT tokeny'
);

console.log('\n📊 Final Project Plan:');
console.log('='.repeat(60));
console.log(JSON.stringify(result, null, 2));
