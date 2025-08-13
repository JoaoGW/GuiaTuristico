# Geo Decoder (Nominatim)

- Arquivo: `src/utils/geoDecoder.ts`
- Função: `reverseGeocodeWithNominatim(latitude: number, longitude: number)`

Consulta o serviço público do OpenStreetMap (Nominatim) para converter coordenadas em cidade e bairro.

## Retorno

```ts
{ city: string; neighborhood: string }
```

- `city`: tenta `city`, `town` ou `village` do payload.
- `neighborhood`: tenta `suburb` ou `neighbourhood`.

## Exemplo

```ts
import { reverseGeocodeWithNominatim } from "@utils/geoDecoder";

const place = await reverseGeocodeWithNominatim(-23.55, -46.63);
// { city: 'São Paulo', neighborhood: 'Bela Vista' }
```

## Notas e limites

- Respeite o rate-limit do Nominatim; evite chamar em loops apertados.
- Erros de rede lançam exceção — trate com try/catch.
