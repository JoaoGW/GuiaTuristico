# FelipeResponseSystem

Motor de respostas rápidas baseado em palavras-chave, ideal para dar uma experiência imediata de guia turístico sem depender de rede.

- Arquivo: `src/services/felipeResponseSystem.ts`
- Exporta: `felipeSystem` (singleton) e a classe `FelipeResponseSystem`

## Como funciona

- Mantém um dicionário de categorias (saudações, praias, aventura etc.) e uma lista de palavras-chave para cada uma.
- Para uma mensagem do usuário, procura a primeira categoria cujo conjunto de palavras-chave aparece no texto (case-insensitive).
- Retorna uma resposta aleatória daquela categoria. Se nada casar, usa respostas de fallback.

## API

- `generateResponse(userMessage: string): string`
  - Entrada: texto livre do usuário.
  - Saída: uma resposta pré-definida representativa da categoria detectada.

## Exemplo de uso

```ts
import { felipeSystem } from "@services/felipeResponseSystem";

const reply = felipeSystem.generateResponse("Quero dicas de praia no nordeste");
// -> string com dica sobre praias
```

## Dicas e limites

- Multilinguismo: as palavras-chave estão em PT-BR; entradas em outros idiomas não serão mapeadas.
- Precisão: é uma lógica simples de `includes`; pode gerar falsos positivos/negativos.
- Personalização: ajuste `responses` e `keywords` para tom/escopo desejado.
