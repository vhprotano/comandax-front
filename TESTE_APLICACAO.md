# ComandaX - Guia de Teste da Aplicação

## 🚀 Iniciando a Aplicação

```bash
npm start
```

Acesse: `http://localhost:4200`

## 🧪 Cenários de Teste

### 1. Teste de Login

#### Teste 1.1: Login como Gerente
1. Selecione o papel **👔 Gerente**
2. Digite qualquer email (ex: `gerente@test.com`)
3. Digite qualquer senha (ex: `123456`)
4. Clique em "Entrar"
5. ✅ Deve redirecionar para `/manager`

#### Teste 1.2: Login como Garçom
1. Selecione o papel **👨‍💼 Garçom**
2. Digite qualquer email (ex: `garcom@test.com`)
3. Digite qualquer senha (ex: `123456`)
4. Clique em "Entrar"
5. ✅ Deve redirecionar para `/waiter`

#### Teste 1.3: Login como Cozinha
1. Selecione o papel **👨‍🍳 Cozinha**
2. Digite qualquer email (ex: `cozinha@test.com`)
3. Digite qualquer senha (ex: `123456`)
4. Clique em "Entrar"
5. ✅ Deve redirecionar para `/kitchen`

### 2. Teste do Dashboard do Gerente

#### Teste 2.1: Visualizar Estatísticas
1. Faça login como Gerente
2. Verifique se os cards de estatísticas aparecem:
   - 📊 Pedidos Hoje
   - 💰 Receita Hoje
   - 🍽️ Produtos
   - 👥 Funcionários
3. ✅ Cards devem ter animações de entrada

#### Teste 2.2: Navegação de Abas
1. Clique em cada aba:
   - 📊 Visão Geral
   - 🍽️ Produtos
   - 📂 Categorias
   - 👥 Funcionários
   - 🪑 Mesas
   - 📋 Pedidos
2. ✅ Cada aba deve carregar seu conteúdo

#### Teste 2.3: Atividade Recente
1. Verifique a seção "Atividade Recente"
2. ✅ Deve mostrar 3 atividades com badges coloridas

### 3. Teste do Dashboard do Garçom

#### Teste 3.1: Criar Nova Comanda
1. Faça login como Garçom
2. Clique em "➕ Nova Comanda"
3. ✅ Deve aparecer um novo card de comanda

#### Teste 3.2: Visualizar Comandas
1. Verifique se as comandas aparecem em grid
2. ✅ Cada comanda deve ter:
   - 🪑 Número da mesa
   - Nome do cliente
   - Status (🔓 Aberta, 📤 Enviada, ✅ Pronta, ✔️ Fechada)
   - Número de itens
   - Valor total
   - Botões de ação

#### Teste 3.3: Ações de Comanda
1. Clique em "📤 Enviar" em uma comanda aberta
2. ✅ Status deve mudar para "📤 Enviada"
3. Clique em "✔️ Fechar" em uma comanda pronta
4. ✅ Status deve mudar para "✔️ Fechada"

#### Teste 3.4: Histórico
1. Clique na aba "📜 Histórico"
2. ✅ Deve mostrar mensagem de desenvolvimento

### 4. Teste do Dashboard da Cozinha

#### Teste 4.1: Layout Kanban
1. Faça login como Cozinha
2. ✅ Deve aparecer 2 colunas:
   - ⏳ Pedidos Pendentes (esquerda)
   - ✅ Pedidos Prontos (direita)

#### Teste 4.2: Pedidos Pendentes
1. Verifique se há pedidos na coluna esquerda
2. ✅ Cada pedido deve ter:
   - 🪑 Número da mesa
   - Nome do cliente
   - 🔴 Badge "Novo"
   - Lista de itens com quantidades
   - Botão "✅ Marcar Pronto"

#### Teste 4.3: Marcar como Pronto
1. Clique em "✅ Marcar Pronto" em um pedido
2. ✅ Pedido deve se mover para coluna de "Pedidos Prontos"
3. ✅ Status deve mudar para "✅ Pronto"

#### Teste 4.4: Pedidos Prontos
1. Verifique a coluna direita
2. ✅ Deve mostrar pedidos prontos com:
   - Status "✅ Pronto"
   - Mensagem "⏱️ Pronto para retirada"

### 5. Teste de Responsividade

#### Teste 5.1: Mobile (320px - 640px)
1. Abra DevTools (F12)
2. Selecione modo mobile
3. Teste em iPhone SE (375px)
4. ✅ Layout deve se adaptar
5. ✅ Menu deve ser responsivo
6. ✅ Cards devem empilhar verticalmente

#### Teste 5.2: Tablet (768px)
1. Selecione modo tablet
2. Teste em iPad (768px)
3. ✅ Layout deve ser otimizado para tablet
4. ✅ Grid deve ter 2 colunas

#### Teste 5.3: Desktop (1024px+)
1. Maximize a janela
2. ✅ Layout deve usar toda a largura
3. ✅ Grid deve ter 3-4 colunas

### 6. Teste de Animações

#### Teste 6.1: Animações de Entrada
1. Recarregue a página
2. ✅ Cards devem aparecer com animação de escala
3. ✅ Ícones devem flutuar suavemente

#### Teste 6.2: Hover Effects
1. Passe o mouse sobre um card
2. ✅ Card deve escalar levemente
3. ✅ Ícone deve aumentar de tamanho

#### Teste 6.3: Transições
1. Clique em diferentes abas
2. ✅ Conteúdo deve aparecer com fade in
3. ✅ Transições devem ser suaves

### 7. Teste de Logout

#### Teste 7.1: Logout
1. Clique no botão "🚪 Sair"
2. ✅ Deve redirecionar para página de login
3. ✅ Dados de sessão devem ser limpos

#### Teste 7.2: Proteção de Rotas
1. Faça logout
2. Tente acessar `/manager` diretamente
3. ✅ Deve redirecionar para `/login`

### 8. Teste de Performance

#### Teste 8.1: Carregamento
1. Abra DevTools (F12)
2. Vá para aba "Network"
3. Recarregue a página
4. ✅ Tempo de carregamento < 3 segundos
5. ✅ Bundle size < 5MB

#### Teste 8.2: Animações Suaves
1. Abra DevTools (F12)
2. Vá para aba "Performance"
3. Grave uma sessão
4. ✅ FPS deve estar acima de 60

### 9. Teste de Acessibilidade

#### Teste 9.1: Navegação por Teclado
1. Pressione Tab para navegar
2. ✅ Todos os botões devem ser acessíveis
3. ✅ Deve haver indicador visual de foco

#### Teste 9.2: Contraste de Cores
1. Verifique contraste de texto
2. ✅ Texto deve ser legível
3. ✅ Cores devem ter bom contraste

### 10. Teste de Compatibilidade

#### Teste 10.1: Navegadores
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### Teste 10.2: Sistemas Operacionais
- [ ] Windows
- [ ] macOS
- [ ] Linux
- [ ] iOS
- [ ] Android

## 📋 Checklist de Teste

- [ ] Login funciona para todos os papéis
- [ ] Navegação entre páginas funciona
- [ ] Animações funcionam suavemente
- [ ] Responsividade testada em 3 tamanhos
- [ ] Logout funciona
- [ ] Rotas protegidas funcionam
- [ ] Performance é boa
- [ ] Sem erros no console
- [ ] Acessibilidade OK
- [ ] Compatibilidade com navegadores

## 🐛 Relatório de Bugs

Se encontrar algum bug, anote:
- Navegador e versão
- Sistema operacional
- Passos para reproduzir
- Comportamento esperado
- Comportamento atual
- Screenshots/vídeos

## ✅ Teste Completo

Se todos os testes passarem, a aplicação está **pronta para produção**!

---

**Data**: 30 de outubro de 2025  
**Versão**: 1.0.0

