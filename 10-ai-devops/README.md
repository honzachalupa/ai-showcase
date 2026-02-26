# AI-Powered DevOps & Infrastructure (2026)

## Revoluce v DevOps

AI transformuje nejen coding, ale celý software lifecycle:
- Infrastructure as Code → **Infrastructure from Prompts**
- Manual monitoring → **Intelligent anomaly detection**
- Reactive scaling → **Predictive auto-scaling**
- Cost guessing → **AI-driven optimization**

## Klíčové oblasti

### 1. **Infrastructure from Code**

AI generuje IaC z natural language:

```
Prompt: "Vytvoř Kubernetes cluster s:
- 3 node pools (web, api, workers)
- Auto-scaling 2-10 nodes
- Load balancer s SSL
- PostgreSQL managed database
- Redis cache
- Monitoring stack (Prometheus + Grafana)"

↓ AI generuje ↓

Terraform + Helm charts + CI/CD pipeline
```

**Nástroje:**
- **Pulumi AI** - natural language → infrastructure
- **Terraform GPT** - AI-assisted IaC
- **AWS CodeWhisperer** - AWS-specific suggestions
- **Google Cloud AI** - GCP infrastructure generation

### 2. **Intelligent Monitoring**

AI detekuje anomálie dřív než alertují:

```python
# Tradiční monitoring:
if cpu_usage > 80%:
    alert("High CPU")

# AI monitoring:
model.predict_anomaly(
    metrics=['cpu', 'memory', 'latency', 'error_rate'],
    context=['time_of_day', 'traffic_pattern', 'deployment_history']
)
# → Detekuje: "Unusual pattern - possible memory leak"
#   3 hours before crash
```

**Platformy:**
- **Datadog AI** - ML-powered anomaly detection
- **New Relic AI** - intelligent alerting
- **Dynatrace Davis** - AI engine pro root cause analysis
- **Grafana ML** - time-series forecasting

### 3. **Predictive Auto-Scaling**

AI předpovídá load a škáluje proaktivně:

```yaml
# Tradiční HPA:
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70

# AI-powered scaling (2026):
apiVersion: ai.k8s.io/v1
kind: PredictiveAutoscaler
spec:
  model: "time-series-forecast"
  lookAhead: "15m"  # Scale 15 min before spike
  features:
    - historical_traffic
    - time_of_day
    - day_of_week
    - marketing_events
    - weather_data  # For delivery apps
  minReplicas: 2
  maxReplicas: 50
```

### 4. **Cost Optimization**

AI analyzuje a navrhuje úspory:

```
AI Cost Analyzer Report:

💰 Potential savings: $12,450/month (38%)

Recommendations:
1. ⚠️  Critical: 15 idle EC2 instances → Save $3,200/mo
2. 💡 RDS instance oversized (10% CPU avg) → Save $1,800/mo
3. 📊 S3 lifecycle policies missing → Save $2,100/mo
4. 🔄 Reserved instances opportunity → Save $4,200/mo
5. 🗑️  Old snapshots (>90 days) → Save $850/mo
6. 🌍 Multi-region redundancy not needed → Save $300/mo

Auto-fix available for items 3, 5, 6
```

**Nástroje:**
- **AWS Cost Anomaly Detection** - ML-powered cost alerts
- **Google Cloud Recommender** - AI optimization suggestions
- **Azure Advisor** - intelligent recommendations
- **Kubecost AI** - Kubernetes cost optimization

### 5. **Security Hardening**

AI audituje a opravuje security issues:

```bash
# AI Security Scan

🔍 Scanning infrastructure...

❌ Critical Issues Found:
1. S3 bucket 'user-uploads' publicly accessible
   → Auto-fix: Add bucket policy to restrict access
   
2. RDS instance allows connections from 0.0.0.0/0
   → Auto-fix: Restrict to VPC security group
   
3. IAM role 'lambda-exec' has admin permissions
   → Auto-fix: Apply least-privilege policy
   
4. Secrets in environment variables (3 found)
   → Auto-fix: Migrate to AWS Secrets Manager
   
5. TLS 1.0 enabled on load balancer
   → Auto-fix: Enforce TLS 1.2+

Apply all fixes? [y/N]
```

**Platformy:**
- **Snyk Infrastructure** - IaC security scanning
- **Wiz** - cloud security posture management
- **Prisma Cloud** - AI-powered threat detection
- **GitHub Advanced Security** - secret scanning, code scanning

### 6. **Incident Response**

AI asistuje při troubleshootingu:

```
Incident: API latency spike (p95: 2.5s → 8.2s)

🤖 AI Analysis:

Root Cause (confidence: 94%):
- Database connection pool exhausted
- Triggered by: Traffic spike from marketing campaign
- Contributing factor: Slow query on users table

Recommended Actions:
1. Immediate: Scale up API pods (2 → 6)
2. Short-term: Increase DB connection pool (20 → 50)
3. Long-term: Add index on users.email column
4. Prevention: Set up predictive scaling

Similar incidents: 2 in last 30 days
Pattern detected: Marketing campaigns → traffic spikes

Auto-remediation available: Yes
Execute? [y/N]
```

## Praktické ukázky

### Infrastructure Generation

```javascript
// infrastructure-from-prompt.js

import { PulumiAI } from '@pulumi/ai';

const ai = new PulumiAI();

const infrastructure = await ai.generate(`
  Create a production-ready Next.js app infrastructure:
  - Vercel for frontend
  - AWS Lambda for API
  - RDS PostgreSQL database
  - S3 for file uploads
  - CloudFront CDN
  - Route53 DNS
  - SSL certificates
  - Monitoring and logging
`);

// Generates complete Pulumi program
await infrastructure.deploy();
```

### Anomaly Detection

```python
# anomaly_detection.py

from datadog import AIMonitoring

monitor = AIMonitoring(
    metrics=['latency', 'error_rate', 'throughput'],
    sensitivity='high',
    auto_remediate=True
)

# AI learns normal patterns
monitor.train(historical_data='30d')

# Detects anomalies in real-time
@monitor.on_anomaly
def handle_anomaly(anomaly):
    print(f"Anomaly detected: {anomaly.description}")
    print(f"Confidence: {anomaly.confidence}")
    print(f"Suggested action: {anomaly.recommendation}")
    
    if anomaly.confidence > 0.9:
        anomaly.auto_remediate()
```

### Cost Optimization

```typescript
// cost-optimizer.ts

import { AWSCostOptimizer } from 'aws-ai-optimizer';

const optimizer = new AWSCostOptimizer({
  autoFix: ['lifecycle-policies', 'unused-resources'],
  requireApproval: ['instance-resizing', 'reserved-instances']
});

const report = await optimizer.analyze();

console.log(`Potential savings: $${report.totalSavings}/month`);

// Auto-apply safe optimizations
await optimizer.applyFixes(report.autoFixable);

// Generate report for manual review
await optimizer.generateReport(report.requiresApproval);
```

## Ukázky v projektu

1. **infrastructure-from-prompt.js** - AI generuje Terraform
2. **anomaly-detection.py** - ML monitoring
3. **predictive-scaling.yaml** - AI auto-scaling
4. **cost-optimizer.ts** - Cost analysis
5. **security-audit.js** - Automated security fixes
6. **incident-response.js** - AI troubleshooting

## ROI Metriky

**Před AI DevOps:**
- Incident response: 2-4 hours
- Manual cost optimization: Monthly
- Infrastructure setup: 2-3 days
- Security audits: Quarterly

**S AI DevOps:**
- Incident response: 5-15 minutes (auto-remediation)
- Continuous cost optimization: Real-time
- Infrastructure setup: 30 minutes
- Security audits: Continuous

**Typické úspory:**
- 💰 Cost: 30-40% reduction
- ⏱️ Time: 70% faster incident resolution
- 🔒 Security: 90% faster vulnerability patching
- 📈 Uptime: 99.9% → 99.99%

## Best Practices

✅ **Do:**
- Start s monitoring a alerting
- Postupně přidávej auto-remediation
- Vždy měj manual override
- Loguj všechny AI decisions
- Pravidelně review AI actions

❌ **Don't:**
- Nepoužívej AI pro critical systems bez testing
- Nedůvěřuj AI naslepo (verify)
- Nezapomínej na compliance requirements
- Neautomatizuj vše najednou (iteruj)
