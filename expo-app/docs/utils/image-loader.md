# Image Loader (destinos)

- Arquivo: `src/utils/imageLoader.ts`
- Responsável por vincular nomes de arquivos de imagem a assets estáticos e por carregar os destinos a partir de `@data/destinations.json`.

## API

- `loadImage(imageName: string)`
  - Retorna o require do asset correspondente ou `@assets/default.webp` como fallback.
- `loadDestinations(): Promise<Array<{ id: number; name: string; description: string; image: any }>>`
  - Mapeia o JSON em objetos prontos para UI, resolvendo a imagem conforme o mapa.

## Exemplo

```ts
import { loadDestinations } from "@utils/imageLoader";

const items = await loadDestinations();
// items: [{ id, name, description, image }, ...]
```

## Dicas

- Garanta que os arquivos citados em `imageMap` existam em `@assets`.
- Em bundlers RN, `require` dinâmico precisa do mapa estático como já implementado.
