# Quick Start - ComandaX

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Iniciar Servidor
```bash
npm start
```

### 3️⃣ Abrir no Navegador
```
http://localhost:4200
```

---

## 🔐 Fazer Login

### Opção 1: Gerente
```
Email: manager@test.com
Senha: 123456
Tipo: MANAGER
```

### Opção 2: Garçom
```
Email: waiter@test.com
Senha: 123456
Tipo: WAITER
```

### Opção 3: Cozinha
```
Email: kitchen@test.com
Senha: 123456
Tipo: KITCHEN
```

---

## 🎯 Primeiros Passos

### Como Gerente
1. ✅ Faça login
2. ✅ Clique em "Produtos"
3. ✅ Clique em "+ Novo Produto"
4. ✅ Preencha os dados
5. ✅ Clique em "Criar"

### Como Garçom
1. ✅ Faça login
2. ✅ Clique em "+ Nova Comanda"
3. ✅ Preencha cliente/mesa
4. ✅ Selecione produtos
5. ✅ Clique em "Enviar para Cozinha"

### Como Cozinha
1. ✅ Faça login
2. ✅ Veja pedidos pendentes
3. ✅ Clique em "Pronto"
4. ✅ Pedido move para prontos

---

## 📁 Estrutura Básica

```
src/
├── app/
│   ├── pages/          # Páginas principais
│   ├── components/     # Componentes reutilizáveis
│   ├── services/       # Lógica de negócio
│   ├── guards/         # Proteção de rotas
│   └── app.routes.ts   # Rotas da aplicação
├── styles.scss         # Estilos globais
└── index.html          # HTML principal
```

---

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
npm start              # Inicia servidor de desenvolvimento
npm run build          # Compila para produção
npm test               # Executa testes
npm run lint           # Verifica código
```

### Limpeza
```bash
npm run clean          # Remove build anterior
rm -rf node_modules    # Remove dependências
npm install            # Reinstala dependências
```

---

## 🎨 Customização Rápida

### Mudar Cores
Edite `src/styles.scss`:
```scss
$primary: #3B82F6;      // Azul
$secondary: #10B981;    // Verde
$danger: #EF4444;       // Vermelho
```

### Mudar Fonte
Edite `src/index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
```

### Mudar Título
Edite `src/index.html`:
```html
<title>ComandaX - Seu Restaurante</title>
```

---

## 🐛 Problemas Comuns

### Porta 4200 já está em uso
```bash
ng serve --port 4300
```

### Erro de compilação
```bash
npm install
npm run build
```

### Limpar cache
```bash
rm -rf .angular/cache
npm start
```

---

## 📱 Testar Responsividade

### No Chrome DevTools
1. Pressione `F12`
2. Pressione `Ctrl+Shift+M`
3. Selecione dispositivo

### Tamanhos para testar
- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px

---

## 🚀 Próximos Passos

### Curto Prazo
1. Explorar a aplicação
2. Testar todas as funcionalidades
3. Customizar cores e textos

### Médio Prazo
1. Integrar com Supabase
2. Adicionar mais produtos
3. Testar em produção

### Longo Prazo
1. Adicionar relatórios
2. Implementar PWA
3. Criar app mobile

---

## 📚 Documentação Completa

- `README.md` - Instruções detalhadas
- `GUIA_TESTE.md` - Cenários de teste
- `ARQUITETURA.md` - Detalhes técnicos
- `PROXIMAS_ETAPAS.md` - Roadmap
- `DEPLOY.md` - Como fazer deploy

---

## 💡 Dicas

1. **Use DevTools** para inspecionar elementos
2. **Abra o console** para ver logs
3. **Teste em mobile** usando DevTools
4. **Leia a documentação** antes de fazer mudanças
5. **Faça commits** frequentes

---

## ✅ Checklist

- [ ] Dependências instaladas
- [ ] Servidor rodando
- [ ] Aplicação abrindo no navegador
- [ ] Login funcionando
- [ ] Produtos criados
- [ ] Comanda criada
- [ ] Pedido enviado para cozinha
- [ ] Pedido marcado como pronto

---

## 🎉 Pronto!

Você está pronto para começar a usar ComandaX!

**Dúvidas?** Consulte a documentação ou abra uma issue no GitHub.

**Boa sorte! 🚀**

