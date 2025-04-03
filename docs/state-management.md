# Gerenciamento de Estado

## 📋 Visão Geral

O gerenciamento de estado da aplicação é feito utilizando o Pinia, que oferece uma solução mais leve e tipada em comparação ao Vuex.

## 🏗️ Estrutura das Stores

### QuizStore

Gerencia o estado do quiz em andamento.

```typescript
interface QuizState {
  currentQuestion: number;
  score: number;
  questions: Question[];
  selectedCategories: number[];
  difficulty: string;
  isComplete: boolean;
  timeRemaining: number;
}
```

**Actions:**
- `startQuiz(categories: number[], difficulty: string)`
- `answerQuestion(questionId: number, answer: string)`
- `nextQuestion()`
- `finishQuiz()`
- `resetQuiz()`

### CategoryStore

Gerencia as categorias disponíveis.

```typescript
interface CategoryState {
  categories: Category[];
  selectedCategories: number[];
  isLoading: boolean;
  error: string | null;
}
```

**Actions:**
- `fetchCategories()`
- `selectCategory(categoryId: number)`
- `deselectCategory(categoryId: number)`
- `clearSelection()`

### UserStore

Gerencia o estado do usuário e suas preferências.

```typescript
interface UserState {
  preferences: UserPreferences;
  history: QuizHistory[];
  statistics: UserStatistics;
}
```

**Actions:**
- `updatePreferences(preferences: UserPreferences)`
- `addQuizHistory(quiz: QuizHistory)`
- `updateStatistics(statistics: UserStatistics)`

## 🔄 Fluxo de Dados

1. **Inicialização:**
   ```typescript
   // main.ts
   import { createPinia } from 'pinia'
   
   const app = createApp(App)
   app.use(createPinia())
   ```

2. **Uso em Componentes:**
   ```typescript
   import { useQuizStore } from '@/stores/quiz'
   
   const quizStore = useQuizStore()
   ```

3. **Composables:**
   ```typescript
   // useQuiz.ts
   export function useQuiz() {
     const quizStore = useQuizStore()
     
     const startNewQuiz = async (categories: number[], difficulty: string) => {
       await quizStore.startQuiz(categories, difficulty)
     }
     
     return {
       startNewQuiz,
       currentQuestion: computed(() => quizStore.currentQuestion),
       score: computed(() => quizStore.score)
     }
   }
   ```

## 📊 Persistência

### LocalStorage

```typescript
// stores/quiz.ts
export const useQuizStore = defineStore('quiz', {
  state: () => ({
    // ... estado
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'quiz-state',
        storage: localStorage,
        paths: ['selectedCategories', 'difficulty']
      }
    ]
  }
})
```

## 🔍 Debug

### Vue DevTools

```typescript
// stores/quiz.ts
export const useQuizStore = defineStore('quiz', {
  state: () => ({
    // ... estado
  }),
  devtools: {
    name: 'Quiz Store',
    enabled: process.env.NODE_ENV === 'development'
  }
})
```

## ⚠️ Considerações

1. **Performance:**
   - Evite armazenar dados desnecessários
   - Use computed properties para derivar dados
   - Implemente cache quando apropriado

2. **Tipagem:**
   - Defina interfaces para todos os estados
   - Use TypeScript para type safety
   - Documente tipos complexos

3. **Testes:**
   - Teste actions isoladamente
   - Mock stores para testes de componentes
   - Teste fluxos de dados completos

4. **Segurança:**
   - Não armazene dados sensíveis
   - Valide dados antes de salvar
   - Implemente sanitização quando necessário 