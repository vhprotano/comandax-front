# Guia de Teste - ComandaX

## 🚀 Como Iniciar

1. Abra o terminal na pasta do projeto
2. Execute: `npm start`
3. Abra o navegador em: `http://localhost:4200`

## 🔐 Credenciais de Teste

### Gerente
- **Email**: manager@test.com
- **Senha**: 123456
- **Tipo**: MANAGER

### Garçom
- **Email**: waiter@test.com
- **Senha**: 123456
- **Tipo**: WAITER

### Cozinha
- **Email**: kitchen@test.com
- **Senha**: 123456
- **Tipo**: KITCHEN

## 📋 Cenários de Teste

### 1. Teste de Login

**Passos:**
1. Acesse a página de login
2. Selecione um tipo de usuário (ex: MANAGER)
3. Digite as credenciais
4. Clique em "Entrar"

**Resultado Esperado:**
- Redirecionamento para o dashboard correspondente
- Exibição do nome do usuário no header
- Notificação de sucesso

---

### 2. Teste do Painel do Gerente

#### 2.1 Gerenciar Produtos

**Passos:**
1. Faça login como MANAGER
2. Clique na aba "Produtos"
3. Clique em "+ Novo Produto"
4. Preencha os dados:
   - Nome: "Hambúrguer Especial"
   - Preço: 25.00
   - Categoria: "Pratos Principais"
5. Clique em "Criar"

**Resultado Esperado:**
- Notificação de sucesso
- Produto aparece na tabela
- Modal fecha automaticamente

**Teste de Edição:**
1. Clique em "Editar" em um produto
2. Altere o preço para 30.00
3. Clique em "Atualizar"

**Resultado Esperado:**
- Preço atualizado na tabela
- Notificação de sucesso

**Teste de Deleção:**
1. Clique em "Deletar" em um produto
2. Confirme a exclusão

**Resultado Esperado:**
- Produto removido da tabela
- Notificação de sucesso

#### 2.2 Gerenciar Categorias

**Passos:**
1. Clique na aba "Categorias"
2. Clique em "+ Nova Categoria"
3. Preencha os dados:
   - Nome: "Bebidas Quentes"
   - Ícone: ☕
   - Cor: Selecione uma cor
4. Clique em "Criar"

**Resultado Esperado:**
- Categoria aparece no grid
- Ícone e cor são exibidos corretamente

---

### 3. Teste do Painel do Garçom

#### 3.1 Criar Nova Comanda

**Passos:**
1. Faça login como WAITER
2. Clique em "+ Nova Comanda"
3. Preencha os dados:
   - Nome do Cliente: "João Silva"
   - Número da Mesa: "Mesa 5"
4. Selecione uma categoria (ex: "Bebidas")
5. Clique em um produto para adicionar ao carrinho
6. Aumente a quantidade se desejar
7. Clique em "Enviar para Cozinha"

**Resultado Esperado:**
- Comanda criada com sucesso
- Redirecionamento para dashboard
- Notificação de sucesso
- Comanda aparece na lista

#### 3.2 Editar Comanda

**Passos:**
1. Clique em "Editar" em uma comanda aberta
2. Adicione mais produtos
3. Altere quantidades
4. Clique em "Enviar para Cozinha"

**Resultado Esperado:**
- Comanda atualizada
- Status muda para "Enviada"

#### 3.3 Fechar Comanda

**Passos:**
1. Aguarde até que a comanda tenha status "Pronta"
2. Clique em "Fechar"

**Resultado Esperado:**
- Status muda para "Fechada"
- Notificação de sucesso

---

### 4. Teste do Painel da Cozinha

#### 4.1 Visualizar Pedidos Pendentes

**Passos:**
1. Faça login como KITCHEN
2. Observe a seção "Pedidos Pendentes"
3. Verifique se os pedidos enviados pelo garçom aparecem

**Resultado Esperado:**
- Pedidos aparecem com cliente/mesa
- Itens são listados com quantidades
- Botão "Pronto" está disponível

#### 4.2 Marcar Pedido como Pronto

**Passos:**
1. Clique em "Pronto" em um pedido pendente
2. Observe a notificação sonora

**Resultado Esperado:**
- Pedido move para "Pedidos Prontos"
- Notificação de sucesso
- Som de notificação toca (se habilitado)

#### 4.3 Visualizar Pedidos Prontos

**Passos:**
1. Observe a seção "Pedidos Prontos"
2. Verifique se os pedidos marcados como prontos aparecem

**Resultado Esperado:**
- Pedidos prontos aparecem com opacidade reduzida
- Informações são exibidas corretamente

---

### 5. Teste de Responsividade

**Passos:**
1. Abra o DevTools (F12)
2. Ative o modo responsivo (Ctrl+Shift+M)
3. Teste em diferentes tamanhos:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px)

**Resultado Esperado:**
- Layout se adapta corretamente
- Todos os elementos são acessíveis
- Sem overflow horizontal

---

### 6. Teste de Notificações

**Passos:**
1. Realize ações que geram notificações:
   - Criar produto
   - Editar categoria
   - Criar comanda
   - Marcar pedido como pronto

**Resultado Esperado:**
- Notificações aparecem no canto superior direito
- Desaparecem automaticamente após alguns segundos
- Ícone e cor correspondem ao tipo

---

### 7. Teste de Navegação

**Passos:**
1. Teste os botões de navegação entre abas
2. Teste o botão "Sair"
3. Tente acessar rotas protegidas sem autenticação

**Resultado Esperado:**
- Navegação funciona corretamente
- Logout redireciona para login
- Rotas protegidas redirecionam para login

---

## 🐛 Checklist de Bugs Comuns

- [ ] Formulários validam corretamente
- [ ] Notificações aparecem e desaparecem
- [ ] Dados persistem durante a sessão
- [ ] Responsividade funciona em todos os tamanhos
- [ ] Animações são suaves
- [ ] Sem erros no console
- [ ] Sem memory leaks
- [ ] Performance é aceitável

---

## 📊 Métricas de Teste

| Funcionalidade | Status | Notas |
|---|---|---|
| Login | ✅ | Funciona com todos os tipos |
| Criar Produto | ✅ | Validação funciona |
| Editar Produto | ✅ | Atualização em tempo real |
| Deletar Produto | ✅ | Confirmação funciona |
| Criar Categoria | ✅ | Cores e ícones funcionam |
| Criar Comanda | ✅ | Carrinho funciona |
| Enviar Comanda | ✅ | Status atualiza |
| Marcar Pronto | ✅ | Notificação funciona |
| Responsividade | ✅ | Todos os tamanhos |
| Notificações | ✅ | Auto-dismiss funciona |

---

## 💡 Dicas

1. Use o DevTools para inspecionar elementos
2. Abra o console para verificar erros
3. Teste em diferentes navegadores
4. Teste com conexão lenta (DevTools > Network)
5. Teste com JavaScript desabilitado (não deve funcionar, é esperado)

---

## 📞 Suporte

Se encontrar bugs ou problemas:
1. Anote os passos para reproduzir
2. Capture screenshots/videos
3. Verifique o console para erros
4. Abra uma issue no repositório

