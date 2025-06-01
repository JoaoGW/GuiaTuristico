# Guia Turístico EZTripAI - Imagens Docker e Automação

Este documento descreve o fluxo de automação de build e publicação das imagens Docker utilizadas no repositório, bem como a lógica de uso dessas imagens via Docker Compose para desenvolvimento local.

## Estrutura das Imagens Docker

O projeto utiliza duas imagens principais:

- **Expo App**: Responsável pelo frontend mobile/web desenvolvido em React Native com Expo.
- **Next.js API**: Backend construído em Next.js, servindo a API da aplicação.

Cada serviço possui seu próprio `Dockerfile` localizado em:

- `expo-app/Docker/Dockerfile.dev` para o Expo App
- `nextjs-api/Docker/Dockerfile` para a Next.js API

## Fluxo de Automação (GitHub Actions)

O arquivo [`docker-publish.yml`](docker-publish.yml) define um workflow do GitHub Actions que automatiza o processo de build e publicação das imagens Docker para o GitHub Container Registry (GHCR).

### Lógica do Workflow

1. **Disparo**: O workflow é executado automaticamente em pushes para o branch `development`.
2. **Checkout**: O repositório é clonado na máquina runner.
3. **Login no GHCR**: O runner faz login no GitHub Container Registry usando o token do GitHub Actions.
4. **Build das Imagens**:
   - A imagem do Expo App é construída usando o `Dockerfile.dev` e tagueada como `ghcr.io/<owner>/guiaturistico/expo-app:latest`.
   - A imagem da Next.js API é construída usando o `Dockerfile` e tagueada como `ghcr.io/<owner>/guiaturistico/nextjs-api:latest`.
5. **Push das Imagens**: Ambas as imagens são enviadas para o GHCR, ficando disponíveis para uso em qualquer ambiente que tenha permissão de acesso.

## Uso das Imagens com Docker Compose

O arquivo [`docker-compose.yml`](docker-compose.yml) orquestra os serviços localmente utilizando as imagens Docker publicadas.

### Lógica de Execução

- **nextjs-api**:
  - Build local a partir do contexto `./nextjs-api` e `Docker/Dockerfile`.
  - Expõe a porta 3000.
  - Utiliza variáveis de ambiente do arquivo `.env.local`.
  - Monta o diretório local como volume para hot reload durante o desenvolvimento.
  - Comando de inicialização: `npm run dev`.

- **expo-app**:
  - Build local a partir do contexto `./expo-app` e `Docker/Dockerfile.dev`.
  - Expõe as portas 19000, 19001 e 19002 para o Metro Bundler, live reload e interface web do Expo.
  - Monta o diretório local como volume para hot reload.
  - Comando de inicialização: `npm start`.
  - Configura o Expo DevTools para escutar em todas as interfaces de rede.

- **Rede**: Ambos os serviços compartilham a rede `app-network` do tipo bridge, permitindo comunicação entre eles.

### Comandos Úteis

Para subir o ambiente de desenvolvimento:
docker-compose up --build

Para parar e remover os containers:
docker-compose down

#### Observação

Solicitei ao Copilot que gerasse este README para documentar o fluxo de automação e uso das imagens Docker no projeto Guia Turístico EZTripAI. O objetivo é facilitar a compreensão do processo de build, publicação e uso das imagens, tanto para novos desenvolvedores quanto para manutenção do projeto.