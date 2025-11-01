# 📖 Guia de Novas Funcionalidades - ComandaX

## 🎯 Como Usar as Novas Funcionalidades

### 1. **Gerenciamento de Funcionários** 👥

#### Acessar
1. Faça login como **GERENTE**
2. Clique na aba **"👥 Funcionários"**

#### Operações
- **Adicionar**: Clique em "+ Novo Funcionário"
  - Preencha: Nome, Email, Telefone, Role (Garçom/Cozinha/Gerente)
  - Clique em "Salvar"

- **Editar**: Clique no botão "✏️ Editar" na linha do funcionário
  - Modifique os dados
  - Clique em "Atualizar"

- **Ativar/Desativar**: Clique no toggle "Ativo/Inativo"
  - Funcionários inativos aparecem com opacidade reduzida

- **Deletar**: Clique no botão "🗑️ Deletar"
  - Confirme a ação

---

### 2. **Visualização de Mesas** 🍽️

#### Acessar
1. Faça login como **GERENTE**
2. Clique na aba **"🍽️ Mesas"**

#### Funcionalidades
- **Status Visual**:
  - 🟢 Verde = Mesa disponível
  - 🔴 Vermelho = Mesa ocupada
  - 🟡 Amarelo = Mesa reservada

- **Informações**:
  - Número da mesa
  - Capacidade (número de lugares)
  - Cliente/Mesa associada
  - Status do pedido

- **Interação**:
  - Passe o mouse sobre uma mesa para ver mais detalhes
  - Clique para expandir informações do pedido

---

### 3. **Histórico de Pedidos** 📋

#### Acessar
1. Faça login como **GERENTE**
2. Clique na aba **"📋 Pedidos"**

#### Filtros e Busca
- **Busca**: Digite cliente, mesa ou ID do pedido
- **Status**: Filtre por Aberta, Enviada, Pronta ou Fechada
- **Ordenação**: Ordene por data (recente/antigo) ou preço (maior/menor)

#### Estatísticas
- **Total de Pedidos**: Quantidade de pedidos filtrados
- **Receita Total**: Soma dos pedidos fechados
- **Ticket Médio**: Valor médio por pedido

#### Tabela
- Visualize todos os pedidos com detalhes
- Scroll horizontal em dispositivos móveis
- Cores indicativas de status

---

### 4. **Recibo/Notinha Final** 🧾

#### Acessar
1. Faça login como **GARÇOM**
2. Abra uma comanda
3. Clique no botão **"🧾 Recibo"** (aparece quando comanda está fechada)

#### Funcionalidades
- **Visualização**:
  - Detalhes do cliente/mesa
  - Lista de itens com quantidades
  - Subtotal, impostos (10%) e total

- **Ações**:
  - **Imprimir**: Clique em "🖨️ Imprimir" para imprimir o recibo
  - **Fechar**: Clique em "Fechar" para voltar

#### Design
- Modal responsivo
- Otimizado para impressão
- Cores profissionais

---

### 5. **Animações** ✨

#### Onde Estão
- **Notificações**: Slide down suave ao aparecer
- **Cards**: Hover com sombra e elevação
- **Botões**: Transições suaves
- **Modais**: Fade in/out

#### Efeitos
- Todas as transições são suaves (0.3-0.6s)
- Animações não bloqueiam interações
- Otimizadas para performance

---

### 6. **Responsividade Mobile** 📱

#### Otimizações
- **Botões**: Tamanho adequado para toque (44px mínimo)
- **Textos**: Redimensionam automaticamente
- **Grids**: Adaptam de 1 coluna (mobile) para 3+ (desktop)
- **Espaçamento**: Ajustado para cada tamanho de tela

#### Teste em Mobile
1. Abra a aplicação em um smartphone
2. Teste as abas do Garçom
3. Verifique se os botões são fáceis de clicar
4. Confirme se o layout se adapta bem

---

## 🔄 Fluxo Completo de Uso

### Gerente
1. ✅ Cadastra funcionários
2. ✅ Visualiza mesas do restaurante
3. ✅ Consulta histórico de pedidos com filtros
4. ✅ Analisa receita e ticket médio

### Garçom
1. ✅ Abre nova comanda
2. ✅ Adiciona produtos
3. ✅ Envia para cozinha
4. ✅ Fecha comanda
5. ✅ Visualiza recibo
6. ✅ Imprime notinha

### Cozinha
1. ✅ Recebe pedidos em tempo real
2. ✅ Marca como pronto
3. ✅ Vê histórico de pedidos

---

## 🎨 Dicas de Design

### Cores Utilizadas
- **Primária**: Azul (#3B82F6)
- **Sucesso**: Verde (#10B981)
- **Aviso**: Amarelo (#F59E0B)
- **Erro**: Vermelho (#EF4444)
- **Neutro**: Cinza (#6B7280)

### Ícones
- 👔 Gerente
- 👨‍💼 Garçom
- 👨‍🍳 Cozinha
- 🍽️ Mesas
- 📋 Pedidos
- 🧾 Recibo

---

## ⚙️ Configurações

### Animações
Para desabilitar animações (se necessário):
1. Abra `src/app/services/animation.service.ts`
2. Modifique a duração para 0

### Impostos
Para alterar a taxa de imposto:
1. Abra `src/app/components/receipt/receipt.component.ts`
2. Modifique a linha: `return this.subtotal * 0.1;` (0.1 = 10%)

### Mesas
Para alterar o número de mesas:
1. Abra `src/app/components/table-view/table-view.component.ts`
2. Modifique: `Array.from({ length: 12 }, ...)` (12 = número de mesas)

---

## 🐛 Troubleshooting

### Animações não funcionam
- Verifique se GSAP está instalado: `npm list gsap`
- Reinicie o servidor: `npm run serve`

### Recibo não imprime
- Verifique as configurações de impressão do navegador
- Teste em outro navegador

### Layout quebrado em mobile
- Limpe o cache: Ctrl+Shift+Delete
- Teste em modo incógnito

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12)
2. Consulte os logs do servidor
3. Verifique a documentação do Angular

---

**Última atualização**: 2025-10-29
**Versão**: 1.0.0

