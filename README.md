# 🍽️ ComandaX - Sistema de Gestão de Comandas

Uma aplicação web moderna, responsiva e animada para gerenciamento de comandas em restaurantes, lanchonetes, bares e similares.

## ✨ Características Principais

### 🎯 3 Papéis de Usuário

#### 👔 Gerente (Manager)
- 📊 Dashboard com estatísticas em tempo real
- 🍽️ Gerenciar produtos (criar, editar, deletar)
- 📂 Gerenciar categorias de produtos
- 👥 Gerenciar funcionários
- 🪑 Visualizar mesas
- 📋 Histórico completo de pedidos

#### 👨‍💼 Garçom (Waiter)
- 📋 Gerenciamento de comandas abertas
- ➕ Criar novas comandas
- ✏️ Adicionar/remover produtos
- 📤 Enviar pedidos para a cozinha
- ✔️ Fechar contas
- 🧾 Visualizar recibos

#### 👨‍🍳 Cozinha (Kitchen)
- ⏳ Visualizar pedidos pendentes
- ✅ Marcar pedidos como prontos
- 📊 Layout Kanban com 2 colunas
- 🔔 Notificações de novos pedidos
- 📤 Pedidos prontos para retirada

## 🚀 Tecnologias Utilizadas

- **Framework**: Angular 20.x (Standalone Components)
- **Linguagem**: TypeScript 5.9.x
- **Animações**: GSAP 3.13.x + CSS Animations
- **State Management**: RxJS 7.8.x
- **UI Components**: Componentes customizados com animações
- **Build Tool**: Angular CLI
- **Responsividade**: Mobile-first com breakpoints Tailwind

### 🎨 Design System
- **Cores**: Primary (Azul), Secondary (Verde), Accent (Laranja)
- **Tipografia**: Inter (body), Poppins (display)
- **Animações**: Fade, Slide, Scale, Rotate, Float, Glow, Bounce
- **Componentes**: Cards, Buttons, Badges, Modals, Notifications, Loading

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone <repository-url>
cd comandax-front
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Abra o navegador em `http://localhost:4200`

## 🔐 Autenticação

### Credenciais de Teste

**Gerente:**
- Email: manager@test.com
- Senha: 123456
- Tipo: MANAGER

**Garçom:**
- Email: waiter@test.com
- Senha: 123456
- Tipo: WAITER

**Cozinha:**
- Email: kitchen@test.com
- Senha: 123456
- Tipo: KITCHEN

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   └── notification-container/
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── pages/
│   │   ├── login/
│   │   ├── manager/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   └── categories/
│   │   ├── waiter/
│   │   │   ├── dashboard/
│   │   │   └── order-form/
│   │   └── kitchen/
│   │       └── dashboard/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── data.service.ts
│   │   └── notification.service.ts
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── main.ts
├── styles.scss
└── index.html
```

## 🎨 Design

A aplicação utiliza um design moderno e responsivo com:
- Paleta de cores profissional
- Ícones emoji para melhor UX
- Animações suaves com GSAP
- Layout adaptável para mobile, tablet e desktop
- Notificações toast para feedback do usuário

## 🔄 Fluxo de Pedidos

1. **Garçom** cria uma nova comanda com cliente/mesa e produtos
2. **Garçom** envia o pedido para a cozinha
3. **Cozinha** recebe notificação em tempo real
4. **Cozinha** marca o pedido como pronto
5. **Garçom** vê o status atualizado e fecha a conta

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

## 🛠️ Desenvolvimento

### Compilar para produção
```bash
npm run build
```

### Executar testes
```bash
npm test
```

### Lint
```bash
npm run lint
```

## 🚀 Deploy

A aplicação pode ser deployada em:
- Vercel
- Netlify
- Firebase Hosting
- AWS S3 + CloudFront
- Qualquer servidor web estático

## 📚 Documentação

- **[GUIA_USO.md](./GUIA_USO.md)** - Guia completo de uso da aplicação
- **[DOCUMENTACAO_TECNICA.md](./DOCUMENTACAO_TECNICA.md)** - Documentação técnica detalhada
- **[DESENVOLVIMENTO.md](./DESENVOLVIMENTO.md)** - Guia para desenvolvimento
- **[RESUMO_MUDANCAS.md](./RESUMO_MUDANCAS.md)** - Resumo de todas as mudanças

## 🎬 Animações e Efeitos

### CSS Tailwind Animations
- `animate-fade-in` - Fade in suave
- `animate-slide-up` - Desliza para cima
- `animate-slide-down` - Desliza para baixo
- `animate-scale-in` - Escala com entrada
- `animate-rotate-in` - Rotação com entrada
- `animate-float` - Flutuação contínua
- `animate-glow` - Efeito de brilho

### GSAP Animations
- Fade in/out
- Slide up/down
- Scale in
- Bounce
- Pulse
- Stagger
- Shake
- Flip

## 📝 Notas Importantes

- ✅ Dados armazenados em localStorage (para demonstração)
- ✅ Autenticação mock (qualquer email/senha funciona)
- ✅ Totalmente responsivo (mobile, tablet, desktop)
- ✅ Sem dependências externas de UI (componentes customizados)
- ⚠️ Para produção: integrar com backend real
- ⚠️ Para produção: implementar autenticação real
- ⚠️ Para produção: adicionar WebSockets para tempo real

## 🎯 Próximas Melhorias

- [ ] Integração com backend real
- [ ] Banco de dados persistente
- [ ] Notificações em tempo real (WebSocket)
- [ ] Relatórios avançados
- [ ] Integração com sistemas de pagamento
- [ ] Aplicativo mobile nativo
- [ ] Temas customizáveis
- [ ] Modo escuro

## 📄 Licença

MIT

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para restaurantes e estabelecimentos.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Versão**: 1.0.0
**Status**: ✅ Pronto para uso
**Última atualização**: 30 de outubro de 2025

