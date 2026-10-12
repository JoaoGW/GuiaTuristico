# Guia Completo de Setup - EZTripAI

Este guia contém o passo a passo completo para configurar e executar o projeto **GuiaTuristico (EZTripAI)** localmente usando Docker.

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Git** - [Download](https://git-scm.com/downloads)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
- **Node.js** (v18 ou superior) - [Download](https://nodejs.org/)
- **Expo Go** no seu dispositivo móvel:
  - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

---

## 1. Clone o Repositório

Abra o terminal/PowerShell e execute:

```bash
git clone https://github.com/JoaoGW/GuiaTuristico.git
cd GuiaTuristico
```

---

## 2. Configurar Variáveis de Ambiente

### 2.1 Configurar API Next.js

Crie o arquivo `.env.local` dentro da pasta `nextjs-api`:

```bash
# Windows PowerShell
cd nextjs-api
New-Item .env.local

# Linux/Mac
cd nextjs-api
touch .env.local
```

Edite o arquivo `.env.local` e adicione suas chaves de API:

```env
OPEN_AI_KEY=sua_chave_openai_aqui
GOOGLE_PLACES_API_KEY=sua_chave_google_places_aqui
WEATHER=sua_chave_weatherapi_aqui
```

**Onde obter as chaves:**
- **Google Places API**: [Google Cloud Console](https://console.cloud.google.com/)
- **OpenAI API**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **WeatherAPI**: [WeatherAPI.com](https://www.weatherapi.com/)

### 2.2 Configurar Firebase (Expo App)

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Baixe o arquivo de configuração do Firebase
3. Copie as credenciais para o arquivo `expo-app/firebase.ts`

---

## 3. Iniciar o Docker

Volte para o diretório raiz do projeto e inicie os containers:

```bash
# Voltar para a raiz
cd ..

# Iniciar os containers Docker
docker-compose up --build
```

**O que está sendo iniciado:**
- **nextjs-api** - Backend Next.js na porta `3000`
- **expo-app** - Aplicativo Expo na porta `19000`

Aguarde até ver as mensagens:
```
nextjs-api | ready - started server on 0.0.0.0:3000
expo-app   | › Metro waiting on exp://192.168.x.x:19000
```

---

## 4. Conectar ao Expo Go

### 4.1 Via QR Code (Recomendado)

1. Abra o **Expo Go** no seu celular
2. No terminal onde o Docker está rodando, localize o QR Code ASCII art ou URL
3. **Android**: Escaneie o QR Code direto pelo Expo Go
4. **iOS**: Use a câmera nativa do iPhone e depois abra no Expo Go

### 4.2 Via URL Manual

Se o QR Code não aparecer, acesse no navegador:

```
http://localhost:19000
```

Uma interface web do Expo Developer Tools será aberta. Use o QR Code exibido lá.

### 4.3 Via Túnel (para redes complexas)

Se estiver em uma rede corporativa ou com firewall, pare o Docker (`Ctrl+C`) e reinicie com túnel:

```bash
docker-compose down
```

Edite o `docker-compose.yml` e altere o comando do `expo-app`:

```yaml
command: npm start -- --tunnel
```

Depois reinicie:

```bash
docker-compose up
```

---

## 5. Verificar se está Funcionando

Quando o app abrir no seu dispositivo:

1. **Permita o acesso à localização** quando solicitado
2. Você deve ver a tela inicial com pontos turísticos próximos
3. Teste criar uma conta ou fazer login
4. Navegue pelo menu lateral para explorar as funcionalidades

---

## 6. Desenvolvimento - Hot Reload

Todas as alterações de código são refletidas automaticamente:

- **Expo App**: Hot reload ativo - salve o arquivo e veja a mudança no celular
- **Next.js API**: Hot reload ativo - salve o arquivo e a API reinicia automaticamente

---

## 7. Comandos Úteis

### Parar os Containers
```bash
docker-compose down
```

### Ver Logs dos Containers
```bash
# Todos os logs
docker-compose logs -f

# Apenas do Expo
docker-compose logs -f expo-app

# Apenas da API
docker-compose logs -f nextjs-api
```

### Reconstruir as Imagens (após mudanças no Dockerfile)
```bash
docker-compose up --build --force-recreate
```

### Limpar Cache do Expo (se houver problemas)
```bash
docker-compose exec expo-app npm start -- --clear
```

### Verificar Problemas no Projeto
```bash
# Dentro do container
docker-compose exec expo-app npx expo doctor

# Ou direto no terminal (fora do Docker)
cd expo-app
npx expo doctor
```

---

## 8. Verificar a Qualidade do Código

O projeto ainda não tem testes automatizados. Use o lint e a verificação de tipos em cada pacote:

```bash
# Expo App
cd expo-app
npm run lint
npx tsc --noEmit

# API Next.js
cd nextjs-api
npm run lint
npx tsc --noEmit
```

---

## 9. Gerar Build de Produção

### APK de Teste (Preview)

```bash
cd expo-app
npx eas build --platform android --profile preview
```

Isso gera um **APK** que pode ser instalado diretamente no Android.

### Build de Produção (AAB para Google Play)

```bash
cd expo-app
npx eas build --platform android --profile production
```

---

## Solução de Problemas Comuns

### Erro: "Unable to resolve module"
```bash
docker-compose down
docker-compose up --build
```

### Erro: "Network request failed"
Certifique-se de que:
1. O container `nextjs-api` está rodando (`docker ps`)
2. O arquivo `.env.local` existe e tem as chaves corretas
3. Seu celular está na mesma rede Wi-Fi do computador

### QR Code não aparece
- Acesse `http://localhost:19000` no navegador
- Ou use o modo túnel: `docker-compose exec expo-app npm start -- --tunnel`

### App não atualiza após mudanças
- Pressione `r` no terminal onde o Expo está rodando para recarregar
- Ou no app, chacoalhe o dispositivo e selecione "Reload"

---

## Suporte

Se encontrar problemas, entre em contato:

- **João Pedro**: [cpsenha@gmail.com](mailto:cpsenha@gmail.com)
- **Caio Pereira**: [caiopereguima92@gmail.com](mailto:caiopereguima92@gmail.com)
- **Lucas Kenji**: [lucaskhayashi@gmail.com](mailto:lucaskhayashi@gmail.com)

Ou abra uma [Issue no GitHub](https://github.com/JoaoGW/GuiaTuristico/issues).

---

## Notas Importantes

- **Não commite** o arquivo `.env.local` no Git (já está no `.gitignore`)
- **Proteja suas chaves de API** - nunca as compartilhe publicamente
- **Desenvolvimento**: Use `docker-compose up` para rodar localmente
- **Produção**: Use builds EAS para distribuição

---

<p align="center">
  Desenvolvido por João Pedro, Lucas Kenji e Caio Pereira
</p>