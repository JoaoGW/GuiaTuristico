# Tags Loader

- Arquivo: `src/utils/tagsLoader.ts`
- Responsável por mapear tags em `@data/tags.json` para objetos prontos para UI com sua imagem correspondente.

## API

- `loadImage(imageName: string)` — retorna o asset correspondente ou `@assets/default.webp`.
- `loadTags(): Promise<Array<{ id: number; name: string; image: any }>>`

## Exemplo

```ts
import { loadTags } from "@utils/tagsLoader";

const tags = await loadTags();
// tags: [{ id, name, image }, ...]
```

## Dicas

- Garanta a presença dos arquivos listados no `imageMap`.
- O uso de `require` estático é essencial para funcionamento no bundler.
