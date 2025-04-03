# Rotas e Navegação

## 📋 Visão Geral

O roteamento da aplicação é gerenciado pelo Vue Router, que fornece uma navegação fluida e mantém o estado da aplicação.

## 🏗️ Estrutura de Rotas

```typescript
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Início',
      requiresAuth: false
    }
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('@/views/QuizView.vue'),
    meta: {
      title: 'Quiz',
      requiresAuth: false
    }
  },
  {
    path: '/results',
    name: 'results',
    component: () => import('@/views/ResultsView.vue'),
    meta: {
      title: 'Resultados',
      requiresAuth: false
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      title: 'Perfil',
      requiresAuth: true
    }
  }
]
```

## 🔒 Proteção de Rotas

### Guardas de Navegação

```typescript
// router/index.ts
router.beforeEach((to, from, next) => {
  // Atualiza o título da página
  document.title = `${to.meta.title} | Quiz App`

  // Verifica autenticação
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'home' })
  } else {
    next()
  }
})
```

## 🔄 Transições

### Animações de Página

```vue
<!-- App.vue -->
<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

## 📱 Navegação Programática

### Exemplos de Uso

```typescript
// Navegação simples
router.push('/quiz')

// Navegação com parâmetros
router.push({
  name: 'results',
  params: { quizId: 123 }
})

// Navegação com query
router.push({
  path: '/quiz',
  query: { category: 'geography' }
})
```

## 🔍 Parâmetros de Rota

### Tipos de Parâmetros

1. **Path Parameters:**
   ```typescript
   {
     path: '/quiz/:id',
     name: 'quiz-detail',
     component: QuizDetailView
   }
   ```

2. **Query Parameters:**
   ```typescript
   // URL: /quiz?category=geography&difficulty=hard
   const category = route.query.category
   const difficulty = route.query.difficulty
   ```

## ⚠️ Considerações

1. **Performance:**
   - Use lazy loading para componentes de rota
   - Implemente prefetching quando apropriado
   - Otimize o bundle size

2. **UX:**
   - Mantenha URLs amigáveis
   - Implemente breadcrumbs
   - Forneça feedback visual durante transições

3. **SEO:**
   - Use meta tags apropriadas
   - Implemente sitemap
   - Mantenha URLs limpas e descritivas

4. **Acessibilidade:**
   - Mantenha foco durante navegação
   - Forneça feedback para leitores de tela
   - Implemente navegação por teclado

## 🔄 Histórico de Navegação

### Manipulação do Histórico

```typescript
// Voltar para página anterior
router.back()

// Avançar para próxima página
router.forward()

// Substituir entrada atual
router.replace('/nova-rota')
```

## 📊 Analytics

### Rastreamento de Navegação

```typescript
router.afterEach((to, from) => {
  // Envia evento para analytics
  analytics.trackPageView({
    path: to.path,
    title: to.meta.title,
    referrer: from.path
  })
})
``` 