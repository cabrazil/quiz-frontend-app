# Serviços e API

## 📋 Visão Geral

Esta documentação descreve os serviços e integrações com a API do backend.

## 🏗️ Estrutura dos Serviços

### API Client

```typescript
// services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptors
api.interceptors.request.use(config => {
  // Adiciona token de autenticação
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    // Tratamento global de erros
    if (error.response?.status === 401) {
      // Redireciona para login
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

## 📚 Serviços Disponíveis

### QuestionService

```typescript
interface QuestionService {
  getQuestions(params: QuestionParams): Promise<Question[]>
  getQuestionById(id: number): Promise<Question>
  getQuestionsByCategory(categoryId: number): Promise<Question[]>
  submitAnswer(questionId: number, answer: string): Promise<AnswerResult>
}

class QuestionServiceImpl implements QuestionService {
  async getQuestions(params: QuestionParams): Promise<Question[]> {
    const response = await api.get('/questions', { params })
    return response.data
  }

  async getQuestionById(id: number): Promise<Question> {
    const response = await api.get(`/questions/${id}`)
    return response.data
  }

  async getQuestionsByCategory(categoryId: number): Promise<Question[]> {
    const response = await api.get(`/categories/${categoryId}/questions`)
    return response.data
  }

  async submitAnswer(questionId: number, answer: string): Promise<AnswerResult> {
    const response = await api.post(`/questions/${questionId}/answer`, { answer })
    return response.data
  }
}
```

### CategoryService

```typescript
interface CategoryService {
  getCategories(): Promise<Category[]>
  getCategoryById(id: number): Promise<Category>
  getCategoryStats(id: number): Promise<CategoryStats>
}

class CategoryServiceImpl implements CategoryService {
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories')
    return response.data
  }

  async getCategoryById(id: number): Promise<Category> {
    const response = await api.get(`/categories/${id}`)
    return response.data
  }

  async getCategoryStats(id: number): Promise<CategoryStats> {
    const response = await api.get(`/categories/${id}/stats`)
    return response.data
  }
}
```

### QuizService

```typescript
interface QuizService {
  startQuiz(params: QuizParams): Promise<QuizSession>
  getQuizSession(id: number): Promise<QuizSession>
  submitQuiz(id: number, answers: Answer[]): Promise<QuizResult>
}

class QuizServiceImpl implements QuizService {
  async startQuiz(params: QuizParams): Promise<QuizSession> {
    const response = await api.post('/quiz/start', params)
    return response.data
  }

  async getQuizSession(id: number): Promise<QuizSession> {
    const response = await api.get(`/quiz/${id}`)
    return response.data
  }

  async submitQuiz(id: number, answers: Answer[]): Promise<QuizResult> {
    const response = await api.post(`/quiz/${id}/submit`, { answers })
    return response.data
  }
}
```

## 🔄 Cache e Performance

### Implementação de Cache

```typescript
// services/cache.ts
class CacheService {
  private cache: Map<string, { data: any; timestamp: number }>
  private readonly TTL = 5 * 60 * 1000 // 5 minutos

  constructor() {
    this.cache = new Map()
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }
}
```

## 🔒 Segurança

### Tratamento de Erros

```typescript
// services/error.ts
class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function handleApiError(error: any): never {
  if (axios.isAxiosError(error)) {
    throw new ApiError(
      error.response?.status || 500,
      error.response?.data?.code || 'UNKNOWN_ERROR',
      error.response?.data?.message || 'Erro desconhecido'
    )
  }
  throw error
}
```

## ⚠️ Considerações

1. **Performance:**
   - Implemente cache quando apropriado
   - Use debounce para requisições frequentes
   - Otimize payload size

2. **Segurança:**
   - Valide dados antes de enviar
   - Sanitize respostas
   - Implemente rate limiting no cliente

3. **UX:**
   - Forneça feedback de loading
   - Implemente retry automático
   - Mantenha estado offline

4. **Manutenção:**
   - Documente tipos e interfaces
   - Mantenha serviços modulares
   - Implemente testes unitários

## 📊 Monitoramento

### Logging

```typescript
// services/logging.ts
class LoggingService {
  logApiCall(endpoint: string, params: any, response: any): void {
    console.log({
      timestamp: new Date().toISOString(),
      endpoint,
      params,
      response
    })
  }

  logError(error: any): void {
    console.error({
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    })
  }
}
``` 