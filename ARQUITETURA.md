# Arquitetura Técnica - ComandaX

## 🏗️ Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Angular)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Components (Standalone)                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   Login     │  │   Manager   │  │   Waiter    │  │   │
│  │  │ Component   │  │ Dashboard   │  │ Dashboard   │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  Kitchen    │  │  Products   │  │ Categories  │  │   │
│  │  │ Dashboard   │  │ Component   │  │ Component   │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Services                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │   │
│  │  │ AuthService  │  │ DataService  │  │ Notif...  │  │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Guards                            │   │
│  │  ┌──────────────┐  ┌──────────────┐                 │   │
│  │  │ AuthGuard    │  │ RoleGuard    │                 │   │
│  │  └──────────────┘  └──────────────┘                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Supabase)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │ users    │  │ products │  │ orders   │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Supabase Services                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │ Auth     │  │ Realtime │  │ Storage  │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Estrutura de Pastas

```
src/
├── app/
│   ├── components/
│   │   └── notification-container/
│   │       ├── notification-container.component.ts
│   │       ├── notification-container.component.html
│   │       └── notification-container.component.scss
│   │
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   │
│   ├── pages/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.scss
│   │   │
│   │   ├── manager/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   └── categories/
│   │   │
│   │   ├── waiter/
│   │   │   ├── dashboard/
│   │   │   └── order-form/
│   │   │
│   │   └── kitchen/
│   │       └── dashboard/
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── data.service.ts
│   │   └── notification.service.ts
│   │
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── main.ts
│
├── styles.scss
├── index.html
└── favicon.ico
```

## 🔄 Fluxo de Dados

### 1. Autenticação

```
User Input (Login Form)
    ↓
AuthService.login()
    ↓
localStorage.setItem('user')
    ↓
Router.navigate() → Dashboard
```

### 2. Criação de Comanda

```
Waiter Input (Order Form)
    ↓
OrderFormComponent.submitOrder()
    ↓
DataService.createOrder()
    ↓
BehaviorSubject.next() (Atualmente)
    ↓
Supabase.insert() (Futuro)
    ↓
WaiterDashboard atualiza (via subscription)
    ↓
KitchenDashboard recebe notificação (via Realtime)
```

### 3. Atualização de Status

```
Kitchen Input (Mark as Ready)
    ↓
KitchenDashboard.markAsReady()
    ↓
DataService.updateOrder()
    ↓
BehaviorSubject.next() (Atualmente)
    ↓
Supabase.update() (Futuro)
    ↓
WaiterDashboard atualiza (via subscription)
```

## 🔐 Segurança

### Autenticação
- JWT tokens (Supabase)
- Refresh tokens
- Secure storage

### Autorização
- Role-based access control (RBAC)
- Route guards
- Component-level permissions

### Validação
- Client-side (Reactive Forms)
- Server-side (Supabase RLS)
- Input sanitization

## 📊 Modelos de Dados

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'MANAGER' | 'WAITER' | 'KITCHEN';
  created_at: Date;
}
```

### Product
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category_id: string;
  active: boolean;
}
```

### Order
```typescript
interface Order {
  id: string;
  customer_name: string;
  table_number: string;
  status: 'open' | 'sent' | 'completed' | 'closed';
  items: OrderItem[];
  total_price: number;
  waiter_id: string;
  created_at: Date;
  updated_at: Date;
}
```

## 🔌 Integração com Supabase

### Configuração
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env['SUPABASE_URL'],
  process.env['SUPABASE_KEY']
)
```

### Exemplo: Buscar Produtos
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('active', true)
```

### Exemplo: Realtime Subscription
```typescript
supabase
  .from('orders')
  .on('*', payload => {
    console.log('Order updated:', payload)
  })
  .subscribe()
```

## 🎨 Design Patterns

### 1. Standalone Components
- Componentes independentes
- Sem NgModule
- Melhor tree-shaking

### 2. Reactive Programming
- RxJS Observables
- BehaviorSubjects
- Async pipe

### 3. Dependency Injection
- Services injetáveis
- Singleton pattern
- Loose coupling

### 4. Smart/Dumb Components
- Smart: Conectados a serviços
- Dumb: Recebem dados via @Input

## 🚀 Performance

### Otimizações
- Lazy loading de rotas
- OnPush change detection
- Unsubscribe automático
- Memoization

### Métricas
- Bundle size: ~146KB
- First contentful paint: < 1s
- Time to interactive: < 2s

## 🧪 Testes

### Estrutura
```
src/
├── app/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── auth.service.spec.ts
│   └── components/
│       ├── login.component.ts
│       └── login.component.spec.ts
```

### Exemplo de Teste
```typescript
describe('AuthService', () => {
  it('should login user', () => {
    const service = TestBed.inject(AuthService)
    service.login('test@test.com', '123456')
    expect(service.isAuthenticated()).toBe(true)
  })
})
```

## 📱 Responsividade

### Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Estratégia
- Mobile-first
- Flexbox/Grid
- Media queries

## 🔄 CI/CD

### GitHub Actions
```yaml
name: Build and Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
      - run: npm run test
```

## 📈 Escalabilidade

### Horizontal
- Múltiplas instâncias
- Load balancing
- CDN

### Vertical
- Otimização de código
- Caching
- Database indexing

## 🎯 Conclusão

A arquitetura de ComandaX é moderna, escalável e segue as melhores práticas do Angular. Com a integração do Supabase, a aplicação será pronta para produção com suporte a tempo real e persistência de dados.

