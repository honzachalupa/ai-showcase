# AI Skills & Capabilities (2026)

## Co jsou AI Skills?

**Skills** = Naučené schopnosti AI specifické pro tvůj projekt, tým nebo domain.

Místo generic AI → **personalizovaný AI coding partner** který:
- Zná tvůj coding style
- Rozumí tvému tech stacku
- Pamatuje si projektové konvence
- Učí se z každého commitu

## Typy Skills

### 1. **Personal Skills**
AI se učí z tvého kódu:
- Coding style (naming, formatting)
- Preferované patterns
- Často používané libraries
- Tvoje chybové vzory

### 2. **Team Skills**
Sdílené znalosti týmu:
- Code review guidelines
- Architectural decisions
- Best practices
- Common pitfalls

### 3. **Domain Skills**
Specializace na odvětví:
- Finance: regulace, compliance
- Healthcare: HIPAA, HL7
- E-commerce: payment flows
- Gaming: physics, rendering

### 4. **Tech Stack Skills**
Deep knowledge konkrétního stacku:
- React + Next.js patterns
- Django best practices
- Kubernetes optimization
- PostgreSQL tuning

## Jak to funguje?

```
1. AI analyzuje tvůj codebase
   ↓
2. Identifikuje patterns a conventions
   ↓
3. Vytvoří skill profile
   ↓
4. Aplikuje při generování kódu
   ↓
5. Učí se z feedback (code reviews, edits)
```

## Platformy podporující Skills

### **Cursor** (2025)
- Automatic skill detection
- Team skill sharing
- Custom rules engine

### **GitHub Copilot Workspace** (2026)
- Organization-wide skills
- Compliance enforcement
- Audit trails

### **Tabnine** (2025)
- Private model training
- Team knowledge base
- On-premise deployment

### **Codeium** (2025)
- Free tier s skills
- Context-aware suggestions
- Multi-repo learning

## Praktické příklady

### Skill: "React Component Patterns"
```javascript
// AI naučený tvůj team pattern:

// ❌ Generic AI by generovalo:
function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

// ✅ AI se skills generuje (tvůj team style):
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
```

### Skill: "Error Handling Convention"
```typescript
// AI ví, že váš tým používá Result type pattern:

// ❌ Generic:
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// ✅ Se skills:
async function fetchUser(id: string): Promise<Result<User, ApiError>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return err(new ApiError(response.status, await response.text()));
    }
    const data = await response.json();
    return ok(UserSchema.parse(data));
  } catch (error) {
    return err(new ApiError(500, 'Network error'));
  }
}
```

### Skill: "Database Query Optimization"
```python
# AI naučený tvoje DB patterns:

# ❌ Generic (N+1 problem):
def get_users_with_posts():
    users = User.objects.all()
    return [
        {
            'user': user,
            'posts': user.posts.all()  # N+1!
        }
        for user in users
    ]

# ✅ Se skills (tvůj team používá select_related):
def get_users_with_posts():
    return (
        User.objects
        .prefetch_related('posts')
        .annotate(post_count=Count('posts'))
        .order_by('-post_count')
    )
```

## Vytvoření vlastního Skill

### 1. **Definuj pravidla**
```yaml
# .ai/skills/react-patterns.yaml
name: "React Component Patterns"
description: "Team conventions for React components"

rules:
  - Always use TypeScript
  - Use forwardRef for components accepting ref
  - Export as named exports, not default
  - Use cn() utility for className merging
  - Add displayName for debugging
  
examples:
  - path: "src/components/ui/button.tsx"
    description: "Reference implementation"
```

### 2. **Trénuj na příkladech**
```bash
# Cursor / Copilot automaticky analyzují:
- Existing codebase
- Merged PRs
- Code review comments
- Team documentation
```

### 3. **Validuj a iteruj**
```javascript
// AI generuje kód → Code review → Feedback → AI se učí
```

## Ukázky

1. **personal-skill-training.js** - Jak natrénovat personal skill
2. **team-skill-sharing.js** - Sdílení skills v týmu
3. **domain-specific-model.py** - Fine-tuning na domain
4. **skill-validation.js** - Testování skill accuracy
5. **continuous-learning.js** - AI se učí z commitů

## Metriky úspěchu

**Před Skills:**
- 60% acceptance rate
- 30% edits needed
- Generic suggestions

**Po Skills:**
- 85% acceptance rate
- 10% edits needed
- Context-aware, team-aligned code

## Best Practices

✅ **Do:**
- Dokumentuj team conventions
- Poskytuj feedback na AI suggestions
- Pravidelně aktualizuj skill definitions
- Sdílej skills napříč týmem
- Měř improvement metrics

❌ **Don't:**
- Nekopíruj skills z jiných projektů naslepo
- Nepoužívej outdated patterns
- Neučíš AI z bad code
- Nezapomínej na security review
