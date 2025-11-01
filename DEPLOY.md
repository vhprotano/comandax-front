# Guia de Deploy - ComandaX

## 🚀 Opções de Deploy

### 1. Vercel (Recomendado)

#### Pré-requisitos
- Conta no Vercel (vercel.com)
- Repositório no GitHub

#### Passos

1. **Fazer push para GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/comandax-front.git
git push -u origin main
```

2. **Conectar ao Vercel**
- Acesse vercel.com
- Clique em "New Project"
- Selecione seu repositório
- Clique em "Import"

3. **Configurar Variáveis de Ambiente**
- Vá para "Settings" > "Environment Variables"
- Adicione:
  ```
  SUPABASE_URL=sua_url_supabase
  SUPABASE_KEY=sua_chave_supabase
  ```

4. **Deploy**
- Clique em "Deploy"
- Aguarde a compilação
- Seu site estará disponível em `https://seu-projeto.vercel.app`

---

### 2. Netlify

#### Pré-requisitos
- Conta no Netlify (netlify.com)
- Repositório no GitHub

#### Passos

1. **Fazer push para GitHub** (mesmo que Vercel)

2. **Conectar ao Netlify**
- Acesse netlify.com
- Clique em "New site from Git"
- Selecione GitHub
- Escolha seu repositório

3. **Configurar Build**
- Build command: `npm run build`
- Publish directory: `dist`

4. **Variáveis de Ambiente**
- Vá para "Site settings" > "Build & deploy" > "Environment"
- Adicione as mesmas variáveis do Vercel

5. **Deploy**
- Clique em "Deploy site"
- Seu site estará disponível em `https://seu-projeto.netlify.app`

---

### 3. Firebase Hosting

#### Pré-requisitos
- Conta no Firebase (firebase.google.com)
- Firebase CLI instalado

#### Passos

1. **Instalar Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Fazer login**
```bash
firebase login
```

3. **Inicializar Firebase**
```bash
firebase init hosting
```

4. **Configurar**
- Public directory: `dist`
- Configure as a single-page app: `Yes`

5. **Build**
```bash
npm run build
```

6. **Deploy**
```bash
firebase deploy
```

---

### 4. AWS S3 + CloudFront

#### Pré-requisitos
- Conta AWS
- AWS CLI instalado

#### Passos

1. **Criar bucket S3**
```bash
aws s3 mb s3://seu-bucket-comandax
```

2. **Build**
```bash
npm run build
```

3. **Upload para S3**
```bash
aws s3 sync dist/ s3://seu-bucket-comandax --delete
```

4. **Criar CloudFront Distribution**
- Acesse AWS Console
- CloudFront > Create Distribution
- Origin: seu bucket S3
- Default Root Object: `index.html`

5. **Configurar DNS**
- Aponte seu domínio para CloudFront

---

## 🔐 Variáveis de Ambiente

### Arquivo `.env.local`
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-publica
```

### Arquivo `.env.production`
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-publica
```

---

## 📋 Checklist de Deploy

- [ ] Código testado localmente
- [ ] Variáveis de ambiente configuradas
- [ ] Build sem erros (`npm run build`)
- [ ] Supabase configurado e testado
- [ ] Domínio customizado configurado
- [ ] SSL/TLS habilitado
- [ ] Backups configurados
- [ ] Monitoramento ativado
- [ ] Analytics configurado
- [ ] Error tracking (Sentry) configurado

---

## 🔄 CI/CD com GitHub Actions

### Arquivo `.github/workflows/deploy.yml`

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test -- --watch=false
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📊 Monitoramento

### Sentry (Error Tracking)

1. **Criar conta** em sentry.io
2. **Instalar SDK**
```bash
npm install @sentry/angular
```

3. **Configurar em `main.ts`**
```typescript
import * as Sentry from "@sentry/angular"

Sentry.init({
  dsn: "sua-dsn-sentry",
  environment: "production"
})
```

### Google Analytics

1. **Criar propriedade** em analytics.google.com
2. **Adicionar script** em `index.html`
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## 🔒 Segurança

### HTTPS
- Todos os provedores oferecem SSL/TLS gratuito
- Ativar redirecionamento HTTP → HTTPS

### CORS
- Configurar CORS no Supabase
- Adicionar domínio de produção

### Headers de Segurança
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## 📈 Performance

### Otimizações
- Minificação de código
- Compressão de assets
- Lazy loading de rotas
- Caching estratégico

### Lighthouse Score
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## 🆘 Troubleshooting

### Build falha
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erro de CORS
- Verificar configuração de CORS no Supabase
- Adicionar domínio de produção

### Erro de variáveis de ambiente
- Verificar se variáveis estão configuradas
- Verificar nomes das variáveis
- Fazer rebuild após adicionar variáveis

---

## 📞 Suporte

- Vercel: vercel.com/support
- Netlify: netlify.com/support
- Firebase: firebase.google.com/support
- AWS: aws.amazon.com/support

---

## 🎯 Próximos Passos

1. Escolher plataforma de deploy
2. Configurar variáveis de ambiente
3. Fazer primeiro deploy
4. Testar em produção
5. Configurar monitoramento
6. Configurar CI/CD

**Tempo estimado**: 1-2 horas

**Recomendação**: Usar Vercel para melhor integração com Angular

