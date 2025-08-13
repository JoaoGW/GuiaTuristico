# Selected Tags Store

Estado simples em módulo para guardar tags selecionadas em memória do processo.

- Arquivo: `src/utils/selectedTagsStore.ts`

## API

- `utilsSetSelectedTags(tags: string[]): void` — substitui o array interno.
- `utilsGetSelectedTags(): string[]` — retorna o array atual.

## Notas

- Não é persistido; zera ao reiniciar o app.
- Em ambientes com múltiplas instâncias do bundle, cada instância mantém seu próprio estado.
