# Estrutura de Imagens do Quiz

Este diretório contém todas as imagens utilizadas no quiz.

## Estrutura de Diretórios

```
assets/
├── questions/
│   ├── default/           # Imagem padrão quando não há imagem específica
│   │   └── image.jpg
│   └── {questionId}/      # Pasta para cada questão
│       └── image.jpg
```

## Convenções de Nomenclatura

- Cada questão deve ter sua própria pasta numerada com seu ID
- A imagem principal de cada questão deve ser nomeada como `image.jpg`
- Formatos suportados: JPEG, PNG e WebP
- Tamanho máximo: 5MB

## Como Adicionar Imagens

1. Crie uma pasta com o ID da questão dentro de `questions/`
2. Adicione a imagem como `image.jpg` dentro desta pasta
3. O caminho da imagem será automaticamente gerado como `/questions/{questionId}/image.jpg`

## Exemplo

Para a questão com ID 1:
```
questions/
└── 1/
    └── image.jpg
```

O caminho da imagem será: `/questions/1/image.jpg`

## Validações

- O sistema validará automaticamente se o caminho da imagem está correto
- Se a imagem não for encontrada, será exibida a imagem padrão
- Apenas imagens nos formatos especificados são permitidas
- O sistema suporta tanto caminhos absolutos quanto relativos 