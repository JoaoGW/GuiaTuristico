<h1 align="center">Guia Turístico (EZTripAI)</h1>

<p align="center">
  Um aplicativo inovador para ajudar viajantes a explorarem o mundo de forma inteligente e personalizada.
  <br />
  Desenvolvido como Trabalho de Conclusão de Curso (TCC), integrando tecnologias modernas como Inteligência Artificial, Firebase e a API da OpenAI.
  <br />
  Conecte-se a experiências únicas, baseadas nas suas preferências e localização, através de uma navegação fluida e prática!
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue" alt="Status do Projeto" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="Licença" />
  <img src="https://img.shields.io/badge/Platform-Mobile%20&%20Web-green" alt="Plataformas" />
</p>

---

## Tecnologias / Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## Principais Funcionalidades

- Busca de pontos turísticos baseada na localização do usuário (necessária a localização do dispositivo)
- Exibição de locais em mapas interativos realtime
- Sugestões e itinerários gerados por IA (OpenAI) via backend feito com Next.js
- Chat com a IA com persistência de histórico
- Chat por voz: gravação, transcrição e resposta com síntese de voz
- Respostas rápidas offline baseadas em palavras‑chave
- Central de notificações no app
- Detecção de conectividade de rede e tratamento de erros necessários
- Fluxo de autenticação completo com Firebase

---

## Demonstrações

<p align="center">
  <img src="https://github.com/user-attachments/assets/763e637a-fd98-4907-aaf1-11539e782956" width="33%" alt="Home Page da Aplicação" />
  <img src="https://github.com/user-attachments/assets/e4e1f3d1-6526-472f-a86c-1eead05c4526" width="33%" alt="Menu de Chat com Assistente IA" />
  <img src="https://github.com/user-attachments/assets/be3b4a7c-02fa-4225-ab8e-9b5fb2012655" width="33%" alt="Chat por Texto com Assistente IA" />
  <img src="https://github.com/user-attachments/assets/319fc442-665d-48b7-bf62-f28c075bfe87" width="33%" alt="Chat por Voz com Assistente IA" />
  <img src="https://github.com/user-attachments/assets/91bb82d8-a475-4d32-a2e2-62fc7593bc7f" width="33%" alt="Página de Perfil do Usuário" />
  <img src="https://github.com/user-attachments/assets/315d8d72-e900-4ee2-9115-b52bf6cb2866" width="33%" alt="Geração de Itinerários Dinâmicos e Personalizados com IA" />
  <img src="https://github.com/user-attachments/assets/767ed35b-46aa-400f-8caf-6107e1edb36a" width="33%" alt="Informações Detalhadas sobre o Destino" />
</p>

---

## Estrutura do Projeto

GuiaTuristico/ <br/>
├── expo-app/src/ <br/>
| ├── assets/ <br/>
| ├── components/ <br/>
| ├── config/ <br/>
| ├── contexts/ <br/>
| ├── data/ <br/>
| ├── hooks/ <br/>
| ├── routes/ <br/>
| ├── screens/ <br/>
| ├── services/ <br/>
| ├── utils/ <br/>
| ├── config.ts <br/>
└── (demais arquivos e configs do app) <br/>

---

## Qualidade de Código

O projeto ainda não tem testes automatizados. Para verificar o código, rode dentro de cada pacote (`expo-app` ou `nextjs-api`): <br/><br/>
npm run lint <br/>
npx tsc --noEmit <br/>

---

## Instalação

Siga os passos abaixo para rodar o projeto localmente:

No bash: <br/>

### Clone o repositório
git clone https://github.com/JoaoGW/GuiaTuristico.git

### Acesse o diretório
cd GuiaTuristico

### Instale as dependências
npm install
ou
yarn install

### Inicie a aplicação
npx expo start

---

## Contato

<a href="https://www.linkedin.com/in/jo%C3%A3o-pedro-do-carmo-ribeiro/">LinkedIn: João Pedro do Carmo Ribeiro</a>
<br/>
<a href="mailto:cpsenha@gmail.com">Email: cpsenha@gmail.com</a>

<a href="https://www.linkedin.com/in/caiopguimaraes/">LinkedIn: Caio Pereira Guimarães</a>
<br/>
<a href="mailto:caiopereguima92@gmail.com">Email: caiopereguima92@gmail.com</a>

<a href="https://www.linkedin.com/in/lucas-k-hayashi/">LinkedIn: Lucas Kenji Hayashi</a>
<br/>
<a href="mailto:lucaskhayashi@gmail.com">Email: lucaskhayashi@gmail.com</a>

---

<p align="center"> Feito por João Pedro, Lucas Kenji e Caio Pereira </p>
