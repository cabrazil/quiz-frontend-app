# Documentação do Frontend

## 📋 Visão Geral

O frontend do Quiz App é uma aplicação web construída com Vue.js 3, TypeScript e Tailwind CSS. Ele fornece uma interface moderna e responsiva para interagir com o backend do quiz.

## 🏗️ Estrutura do Projeto

```
frontend/
├── src/
│   ├── main.ts           # Ponto de entrada da aplicação
│   ├── App.vue          # Componente raiz
│   ├── components/      # Componentes reutilizáveis
│   ├── views/          # Páginas/Views da aplicação
│   ├── stores/         # Gerenciamento de estado (Pinia)
│   ├── services/       # Serviços e chamadas à API
│   ├── types/          # Definições de tipos TypeScript
│   ├── assets/         # Recursos estáticos
│   └── router/         # Configuração de rotas
├── public/             # Arquivos públicos
└── tests/             # Testes
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório frontend com as seguintes variáveis:

```env
VITE_API_URL=http://localhost:3000/api
```

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📚 Documentação Detalhada

- [Componentes](./components.md)
- [Gerenciamento de Estado](./state-management.md)
- [Rotas e Navegação](./routing.md)
- [Serviços e API](./services.md)

## 🚀 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila o projeto para produção
- `npm run preview`: Visualiza a build de produção localmente
- `npm run test`: Executa os testes
- `npm run lint`: Executa o linter

## 🔍 Logs e Debug

- Em desenvolvimento, os logs são exibidos no console do navegador
- Utilize o Vue DevTools para debug de componentes e estado
- Logs de erro são capturados e exibidos na interface

## 🔒 Segurança

- Validação de entrada em todos os formulários
- Sanitização de dados antes de exibir
- Proteção contra XSS
- CORS configurado para comunicação segura com o backend

## 📦 Dependências Principais

- vue: Framework principal
- vue-router: Roteamento
- pinia: Gerenciamento de estado
- typescript: Linguagem de programação
- tailwindcss: Framework CSS
- axios: Cliente HTTP

## 🤝 Contribuindo

Veja o [README principal](../../README.md) para instruções sobre como contribuir com o projeto. 