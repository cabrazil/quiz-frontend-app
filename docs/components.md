# Componentes do Frontend

## 📋 Visão Geral

Esta documentação descreve os principais componentes da aplicação, sua estrutura e uso.

## 🎯 Componentes Base

### QuestionCard

Componente para exibir uma questão individual.

**Props:**
- `question`: Objeto Question
- `showAnswer`: boolean (opcional)
- `onAnswer`: Function (opcional)

**Eventos:**
- `answer-selected`: Emitido quando uma resposta é selecionada
- `explanation-requested`: Emitido quando o usuário solicita a explicação

### CategorySelector

Componente para seleção de categorias.

**Props:**
- `selectedCategories`: number[]
- `onChange`: Function

### DifficultySelector

Componente para seleção do nível de dificuldade.

**Props:**
- `selectedDifficulty`: string
- `onChange`: Function

## 📱 Páginas

### HomeView

Página inicial com opções de configuração do quiz.

**Funcionalidades:**
- Seleção de categorias
- Seleção de dificuldade
- Início do quiz

### QuizView

Página principal do quiz.

**Funcionalidades:**
- Exibição de questões
- Contagem de tempo
- Pontuação
- Navegação entre questões

### ResultsView

Página de resultados do quiz.

**Funcionalidades:**
- Exibição da pontuação final
- Análise de desempenho
- Opções para novo quiz

## 🎨 Componentes de UI

### Button

Botão reutilizável com variantes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean

### ProgressBar

Barra de progresso para indicar avanço.

**Props:**
- `value`: number
- `max`: number
- `showLabel`: boolean

### Alert

Componente para exibir mensagens de alerta.

**Props:**
- `type`: 'success' | 'error' | 'warning' | 'info'
- `message`: string
- `dismissible`: boolean

## 🔄 Componentes de Estado

### LoadingSpinner

Indicador de carregamento.

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `color`: string

### ErrorMessage

Exibição de mensagens de erro.

**Props:**
- `message`: string
- `retryAction`: Function (opcional)

## 🎯 Componentes de Layout

### Header

Cabeçalho da aplicação.

**Funcionalidades:**
- Logo
- Menu de navegação
- Estado do usuário

### Footer

Rodapé da aplicação.

**Funcionalidades:**
- Links úteis
- Informações de copyright
- Redes sociais

## ⚠️ Considerações

1. **Responsividade:**
   - Todos os componentes são responsivos
   - Utilizam classes do Tailwind CSS
   - Adaptam-se a diferentes tamanhos de tela

2. **Acessibilidade:**
   - Componentes seguem as diretrizes WCAG
   - Suporte a navegação por teclado
   - Mensagens de erro acessíveis

3. **Performance:**
   - Lazy loading de componentes pesados
   - Otimização de re-renders
   - Cache de dados quando apropriado

4. **Testes:**
   - Testes unitários para componentes críticos
   - Testes de integração para fluxos principais
   - Testes de acessibilidade 