# 🚀 Como Executar a Aplicação ComandaX

## 📋 Pré-requisitos

- **Node.js**: v18.x ou superior
- **npm**: v9.x ou superior
- **Git**: Para clonar o repositório (opcional)

### Verificar Versões
```bash
node --version
npm --version
```

---

## 🔧 Instalação

### 1. Navegar para o Diretório do Projeto
```bash
cd c:\Users\vhpro\OneDrive\Documentos\Victor\comandax-front
```

### 2. Instalar Dependências
```bash
npm install
```

Isso instalará:
- Angular 20.x
- TypeScript 5.9.x
- Tailwind CSS
- GSAP 3.13.0
- Supabase
- E outras dependências

---

## ▶️ Executar a Aplicação

### Desenvolvimento (Com Hot Reload)
```bash
npm run serve
```

A aplicação estará disponível em: **http://localhost:4200**

### Build para Produção
```bash
npm run build
```

Os arquivos compilados estarão em: `dist/`

---

## 🧪 Testar a Aplicação

### Credenciais de Teste

#### Gerente
- **Email**: manager@test.com
- **Senha**: 123456
- **Role**: MANAGER

#### Garçom
- **Email**: waiter@test.com
- **Senha**: 123456
- **Role**: WAITER

#### Cozinha
- **Email**: kitchen@test.com
- **Senha**: 123456
- **Role**: KITCHEN

### Fluxo de Teste Recomendado

#### 1. Teste como Gerente
1. Faça login com credenciais de gerente
2. Acesse "👥 Funcionários" e adicione um novo funcionário
3. Acesse "🍽️ Mesas" e visualize as mesas
4. Acesse "📋 Pedidos" e teste os filtros

#### 2. Teste como Garçom
1. Faça login com credenciais de garçom
2. Clique em "+ Nova Comanda"
3. Adicione alguns produtos
4. Envie para a cozinha
5. Feche a comanda
6. Clique em "🧾 Recibo" e teste a impressão

#### 3. Teste como Cozinha
1. Faça login com credenciais de cozinha
2. Veja os pedidos pendentes
3. Marque como pronto
4. Veja os pedidos completados

---

## 📱 Testar Responsividade

### No Navegador
1. Abra a aplicação em http://localhost:4200
2. Pressione **F12** para abrir DevTools
3. Clique no ícone de dispositivo móvel (Ctrl+Shift+M)
4. Teste em diferentes tamanhos:
   - **Mobile**: 375x667 (iPhone)
   - **Tablet**: 768x1024 (iPad)
   - **Desktop**: 1920x1080

### Em Dispositivo Real
1. Encontre o IP da sua máquina: `ipconfig` (Windows)
2. Acesse: `http://<seu-ip>:4200`
3. Teste em smartphone ou tablet

---

## 🔍 Verificar Erros

### Console do Navegador
1. Pressione **F12**
2. Vá para a aba **Console**
3. Procure por erros em vermelho

### Terminal
Verifique a saída do comando `npm run serve` para erros de compilação

---

## 🛠️ Comandos Úteis

### Limpar Cache
```bash
npm cache clean --force
```

### Reinstalar Dependências
```bash
rm -r node_modules
npm install
```

### Verificar Versões Instaladas
```bash
npm list
```

### Atualizar Dependências
```bash
npm update
```

---

## 📦 Estrutura do Projeto

```
comandax-front/
├── src/
│   ├── app/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas (Manager, Waiter, Kitchen)
│   │   ├── services/          # Serviços (Data, Auth, Animation)
│   │   ├── app.component.ts   # Componente raiz
│   │   └── app.routes.ts      # Rotas da aplicação
│   ├── index.html             # HTML principal
│   └── styles.css             # Estilos globais
├── angular.json               # Configuração Angular
├── tsconfig.json              # Configuração TypeScript
├── package.json               # Dependências
└── README.md                  # Documentação
```

---

## 🌐 Variáveis de Ambiente

### Criar arquivo `.env` (se necessário)
```
SUPABASE_URL=sua_url_aqui
SUPABASE_KEY=sua_chave_aqui
```

### Usar em `environment.ts`
```typescript
export const environment = {
  supabaseUrl: process.env['SUPABASE_URL'],
  supabaseKey: process.env['SUPABASE_KEY'],
};
```

---

## 🚨 Problemas Comuns

### Porta 4200 já está em uso
```bash
# Usar outra porta
ng serve --port 4201
```

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
npm install
```

### Erro de TypeScript
```bash
# Limpar cache e reconstruir
npm run build
```

### Animações não funcionam
- Verifique se GSAP está instalado
- Reinicie o servidor

---

## 📊 Performance

### Verificar Performance
1. Abra DevTools (F12)
2. Vá para a aba **Performance**
3. Clique em **Record**
4. Interaja com a aplicação
5. Clique em **Stop**

### Otimizações Implementadas
- ✅ Lazy loading de rotas
- ✅ OnPush change detection
- ✅ Componentes standalone
- ✅ Tree-shaking automático

---

## 🔐 Segurança

### Boas Práticas
- ✅ Senhas armazenadas com hash
- ✅ Tokens JWT para autenticação
- ✅ Proteção de rotas com guards
- ✅ Validação de formulários

### Antes de Produção
1. Altere as credenciais de teste
2. Configure HTTPS
3. Implemente rate limiting
4. Configure CORS adequadamente

---

## 📚 Recursos Adicionais

- [Documentação Angular](https://angular.io)
- [Tailwind CSS](https://tailwindcss.com)
- [GSAP](https://greensock.com/gsap/)
- [TypeScript](https://www.typescriptlang.org)

---

## ✅ Checklist de Execução

- [ ] Node.js e npm instalados
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor iniciado (`npm run serve`)
- [ ] Aplicação acessível em http://localhost:4200
- [ ] Login funcionando
- [ ] Todas as abas carregando
- [ ] Animações funcionando
- [ ] Responsividade testada

---

**Última atualização**: 2025-10-29
**Versão**: 1.0.0

