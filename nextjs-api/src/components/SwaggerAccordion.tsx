// Este componente foi criado pelo Claude Sonnet 4 por fins de teste deste modelo de IA
"use client";

import { useState } from "react";

interface ApiEndpoint {
  method: string;
  path: string;
  summary: string;
  description: string;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  responses: { [key: string]: { description: string; example?: object } };
}

export default function SwaggerAccordion() {
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  const toggleAccordion = (id: string) => {
    const newOpenAccordions = new Set(openAccordions);
    if (newOpenAccordions.has(id)) {
      newOpenAccordions.delete(id);
    } else {
      newOpenAccordions.add(id);
    }
    setOpenAccordions(newOpenAccordions);
  };
  // Erros seguem sempre { error: "Mensagem em pt-BR.", code?: "CODIGO" }. As rotas de IA aplicam limite de uso
  // (429 RATE_LIMITED) e, com AI_AUTH_REQUIRED=true, exigem "Authorization: Bearer <ID token do Firebase>" (401 UNAUTHENTICATED).
  const aiErrors = {
    "401": { description: "Token ausente ou inválido (somente com AI_AUTH_REQUIRED=true)", example: { error: "Entre na sua conta para usar este recurso.", code: "UNAUTHENTICATED" } },
    "405": { description: "Método não permitido (apenas POST)", example: { error: "Método não permitido. Use POST." } },
    "429": { description: "Limite de uso da rota ou da OpenAI atingido", example: { error: "Muitas solicitações em pouco tempo. Tente novamente em instantes.", code: "RATE_LIMITED" } },
    "500": { description: "Falha de autenticação com a OpenAI ou erro interno", example: { error: "Erro de autenticação no serviço de IA.", code: "AI_AUTH_ERROR" } },
    "502": { description: "OpenAI indisponível (rede ou 5xx)", example: { error: "Serviço de IA indisponível no momento.", code: "AI_UNAVAILABLE" } },
    "503": { description: "OPEN_AI_KEY não configurada (AI_UNAVAILABLE) ou conta da OpenAI sem saldo (AI_QUOTA_EXCEEDED)", example: { error: "Serviço de IA indisponível.", code: "AI_UNAVAILABLE" } },
    "504": { description: "A OpenAI passou do tempo limite da chamada", example: { error: "O serviço de IA demorou para responder. Tente novamente.", code: "AI_TIMEOUT" } }
  };

  // Chat, justchat e voz consomem "mensagens" (ganhas com anúncios recompensados) quando a cobrança está ligada.
  const messageErrors = {
    "402": { description: "Saldo de mensagens insuficiente (texto custa 1, voz custa 5); nada é enviado à IA", example: { error: "Assista a um anúncio para continuar conversando com o Felipe.", code: "NEEDS_REWARDED_AD" } }
  };

  const apiEndpoints: ApiEndpoint[] = [
    {
      method: "POST",
      path: "/api/voiceChat",
      summary: "Chat por voz unificado",
      description: "Transcrição de áudio (whisper-1) + resposta do Felipe (gpt-6-luna) em uma única chamada, com cache de respostas similares. Outro formato de áudio só é tentado quando a OpenAI recusa o formato.",
      parameters: [
        { name: "audio", type: "file", required: true, description: "Arquivo com mimetype audio/* (máx. 2 MB, ~15 segundos). Formatos aceitos pela OpenAI: flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm." }
      ],
      responses: {
        "200": {
          description: "Processamento completo realizado com sucesso",
          example: {
            success: true,
            transcription: "Quais são as melhores atrações do Rio de Janeiro?",
            response: "O Rio de Janeiro oferece diversas atrações...",
            audioInfo: { originalName: "recording.m4a", size: 1024000, duration: "Estimado: ~15 segundos máximo" },
            usage: { transcriptionModel: "whisper-1", chatModel: "gpt-6-luna", totalTokens: 0, usedCache: false }
          }
        },
        "400": { description: "Sem arquivo de áudio, arquivo vazio ou formato não reconhecido", example: { error: "Envie um arquivo de áudio no campo \"audio\".", code: "AUDIO_REQUIRED" } },
        "413": { description: "Arquivo acima de 2 MB", example: { error: "Arquivo muito grande. O áudio deve ter no máximo 2 MB (cerca de 15 segundos).", code: "AUDIO_TOO_LARGE" } },
        "422": { description: "Transcrição vazia", example: { error: "Não foi possível entender o áudio. Tente gravar novamente.", code: "EMPTY_TRANSCRIPTION" } },
        ...messageErrors,
        ...aiErrors
      }
    },
    {
      method: "POST",
      path: "/api/chat",
      summary: "Chat com IA (texto, resposta única)",
      description: "Pergunta isolada ao Felipe (gpt-6-luna) com o system prompt do servidor. O campo context não é mais aceito. Sem consumidor atual no app.",
      parameters: [
        { name: "message", type: "string", required: true, description: "Pergunta sobre turismo (até 2000 caracteres)" }
      ],
      responses: {
        "200": {
          description: "Resposta da IA gerada com sucesso",
          example: { success: true, response: "Recomendo começar pelo centro histórico...", usage: { total_tokens: 0 } }
        },
        "400": { description: "message ausente, vazio ou acima do limite", example: { error: "O campo \"message\" é obrigatório e deve ser um texto.", code: "INVALID_INPUT" } },
        ...messageErrors,
        ...aiErrors
      }
    },
    {
      method: "GET",
      path: "/api/cacheStats",
      summary: "Estatísticas do cache",
      description: "Estatísticas do cache de respostas do chat por voz. DELETE limpa o cache apenas em desenvolvimento (403 em produção).",
      responses: {
        "200": {
          description: "Estatísticas do cache retornadas com sucesso",
          example: {
            success: true,
            stats: { size: 12, hitRate: 0.3, predefinedCount: 16, estimatedSavings: "0.001560 USD", description: "Cache de respostas similares para economia de recursos" }
          }
        },
        "403": { description: "DELETE em produção", example: { error: "Limpeza do cache disponível apenas em desenvolvimento." } },
        "405": { description: "Método não permitido (apenas GET ou DELETE)", example: { error: "Método não permitido. Use GET ou DELETE." } }
      }
    },
    {
      method: "POST",
      path: "/api/generateItinerary",
      summary: "Gerar itinerário de viagem",
      description: "Monta o prompt no servidor a partir das preferências e pede à OpenAI (gpt-6-luna) um JSON validado por schema. Sem countries, a IA escolhe continente e países (Modo Surpresa). Créditos: 1 a cada bloco de até 7 dias (1–7 dias = 1, 8–14 = 2, 15–21 = 3, 22–28 = 4). A API planeja a viagem inteira (plan: data, dia da semana, cidade e atrações principais de cada dia) e gera os blocos de 7 dias em paralelo, sem repetir atrações entre eles; só os blocos gerados são cobrados (credits.charged) e os dias dos blocos que falharam vêm em missingDays. Para tentar de novo só esses blocos, reenvie as mesmas preferências com o plan recebido e blocks (ex.: [2]); cada bloco gerado consome 1 crédito. Se nenhum bloco sair, a resposta é 502 ITINERARY_INCOMPLETE (ou o erro da IA) e nada é cobrado. Cobrança (quando o RevenueCat está configurado): antes de chamar a IA, a API reserva (debita) no RevenueCat os créditos dos blocos pedidos (402 INSUFFICIENT_CREDITS se o saldo não cobrir) e, no fim, devolve os blocos que falharam, de modo que o saldo final desconta só credits.charged (credits.debited = true; false se a devolução falhou e ficou para conciliação; null com a cobrança desligada). A data de início precisa estar em DD/MM/AAAA (ou AAAA-MM-DD); outro formato responde 400. Corpo limitado a 64 KB (acima disso o Next.js responde 413 em texto). Respostas cortadas pelo limite ou recusadas por causa das preferências (ex.: desejo especial pedindo textos enormes) são cobradas: o bloco entra em credits.forfeited e, se nada sair, a resposta é 422 ITINERARY_REJECTED. Com a cobrança ligada, o formato antigo { prompt } responde 426 APP_UPDATE_REQUIRED. Transição: o corpo antigo { prompt } ainda é aceito e devolve { message } em texto (formato DAY->...), até os builds anteriores ao FE-20 saírem de uso. Tempo máximo da rota: 120 s.",
      parameters: [
        { name: "dateBegin", type: "string", required: true, description: "Data de início em DD/MM/AAAA (ou AAAA-MM-DD); define o calendário e os dias da semana" },
        { name: "dateEnd", type: "string", required: true, description: "Data de término" },
        { name: "days", type: "integer", required: true, description: "Quantidade de dias (1 a 28)" },
        { name: "continent", type: "string", required: false, description: "Continente (ignorado no Modo Surpresa)" },
        { name: "countries", type: "string[]", required: false, description: "Países (0 a 10); vazio ativa o Modo Surpresa" },
        { name: "originCountry", type: "string", required: true, description: "País de origem do grupo" },
        { name: "budget", type: "number", required: true, description: "Orçamento (≥ 0)" },
        { name: "peopleQuantity", type: "integer", required: true, description: "Total de viajantes, incluindo quem cria o roteiro (1 a 50); viajante solo = 1" },
        { name: "accompanying", type: "string", required: true, description: "Companhia da viagem" },
        { name: "tripStyles", type: "string[]", required: true, description: "Estilos de viagem (1 a 10)" },
        { name: "locomotionMethods", type: "string[]", required: true, description: "Meios de locomoção (1 a 10)" },
        { name: "specialWish", type: "string", required: false, description: "Desejo especial (até 300 caracteres)" },
        { name: "userPreferences", type: "string[]", required: false, description: "Preferências do usuário (até 30)" },
        { name: "plan", type: "{ continent, countries[], days: [{ date, weekday, location, highlights[] }] }", required: false, description: "Nova tentativa: o plan devolvido pela API para este roteiro (obrigatório junto com blocks)" },
        { name: "blocks", type: "integer[]", required: false, description: "Nova tentativa: números dos blocos a gerar (1 = dias 1–7, 2 = dias 8–14...)" }
      ],
      responses: {
        "200": {
          description: "Itinerário gerado e validado",
          example: {
            itinerary: {
              continent: "Europa",
              countries: ["Portugal"],
              days: [{
                day: 1,
                date: "2026-12-01",
                location: "Lisboa, Portugal",
                timeline: [{ time: "09:00", title: "Visita ao local", description: "Descrição detalhada da atividade...", coordinates: { latitude: 38.7, longitude: -9.1 }, category: "Ponto Turístico" }],
                suggestedActivities: ["Atividade extra recomendada"],
                pixabayTags: "lisboa, portugal"
              }]
            },
            plan: { continent: "Europa", countries: ["Portugal", "Espanha"], days: [{ date: "2026-12-01", weekday: "terça-feira", location: "Lisboa, Portugal", highlights: ["Mosteiro dos Jerónimos", "Torre de Belém"] }] },
            credits: { required: 2, charged: 1, forfeited: 0, debited: true },
            missingDays: [8, 9, 10, 11, 12, 13, 14]
          }
        },
        "400": { description: "Preferências, plan ou blocks inválidos", example: { error: "O campo \"days\" deve ser um número inteiro entre 1 e 28.", code: "INVALID_INPUT" } },
        "402": { description: "Saldo de créditos no RevenueCat insuficiente para os blocos pedidos (nada é gerado nem cobrado)", example: { error: "Créditos insuficientes para gerar este roteiro.", code: "INSUFFICIENT_CREDITS" } },
        "422": { description: "A IA recusou ou não concluiu nenhum bloco por causa das preferências; os créditos são consumidos", example: { error: "A IA não conseguiu concluir o roteiro com as preferências informadas. Revise o desejo especial e tente de novo.", code: "ITINERARY_REJECTED" } },
        "426": { description: "Formato antigo { prompt } com a cobrança ligada", example: { error: "Atualize o app para gerar novos roteiros.", code: "APP_UPDATE_REQUIRED" } },
        ...aiErrors,
        "502": { description: "Roteiro truncado, inválido ou OpenAI indisponível", example: { error: "O roteiro gerado veio incompleto. Tente gerar novamente.", code: "ITINERARY_INCOMPLETE" } }
      }
    },
    {
      method: "GET",
      path: "/api/googlePhotoProxy",
      summary: "Proxy para fotos do Google Places",
      description: "Busca a imagem do lugar no Google Places (maxwidth=400) sem expor a chave ao app.",
      parameters: [
        { name: "photo_reference", type: "string", required: true, description: "photos[0].photo_reference devolvido por /api/googlePlacesApi" }
      ],
      responses: {
        "200": { description: "Bytes da imagem (content-type image/*)" },
        "400": { description: "photo_reference ausente ou inválido", example: { error: "photo_reference ausente ou inválido.", code: "INVALID_INPUT" } },
        "405": { description: "Método não permitido (apenas GET)", example: { error: "Método não permitido. Use GET." } },
        "502": { description: "Falha ao obter a imagem no Google", example: { error: "Não foi possível carregar a foto agora.", code: "PHOTO_UNAVAILABLE" } },
        "503": { description: "GOOGLE_PLACES_API_KEY não configurada", example: { error: "Serviço de lugares indisponível.", code: "PLACES_UNAVAILABLE" } }
      }
    },
    {
      method: "GET",
      path: "/api/googlePlacesApi",
      summary: "Buscar lugares próximos",
      description: "Pontos turísticos (tourist_attraction) num raio de 1500 m, mapeados para um DTO próprio. A foto vem só como photo_reference: o app monta /api/googlePhotoProxy?photo_reference=...",
      parameters: [
        { name: "latitude", type: "number", required: true, description: "Latitude entre -90 e 90" },
        { name: "longitude", type: "number", required: true, description: "Longitude entre -180 e 180" }
      ],
      responses: {
        "200": {
          description: "Lista de lugares próximos",
          example: {
            results: [{
              place_id: "ChIJ...",
              name: "Nome do lugar",
              vicinity: "Endereço",
              rating: 4.5,
              icon: "https://maps.gstatic.com/...png",
              geometry: { location: { lat: -23.58, lng: -46.65 } },
              opening_hours: { open_now: true },
              photos: [{ photo_reference: "AbCd..." }]
            }]
          }
        },
        "400": { description: "Coordenadas ausentes ou fora do intervalo", example: { error: "Latitude e longitude são obrigatórias.", code: "INVALID_INPUT" } },
        "405": { description: "Método não permitido (apenas GET)", example: { error: "Método não permitido. Use GET." } },
        "502": { description: "Falha no Google Places", example: { error: "Não foi possível buscar lugares próximos agora.", code: "PLACES_UNAVAILABLE" } },
        "503": { description: "GOOGLE_PLACES_API_KEY não configurada", example: { error: "Serviço de lugares indisponível.", code: "PLACES_UNAVAILABLE" } }
      }
    },
    {
      method: "POST",
      path: "/api/justchat",
      summary: "Chat do Felipe com histórico",
      description: "Chat de texto do app. A persona do Felipe e a regra de responder só sobre turismo ficam no system prompt do servidor. Envia as últimas 10 mensagens à OpenAI (gpt-6-luna).",
      parameters: [
        { name: "messages", type: "{ role: \"user\" | \"assistant\", content: string }[]", required: false, description: "Histórico (1 a 50 itens, até 4000 caracteres cada); a última mensagem deve ser do usuário" },
        { name: "prompt", type: "string", required: false, description: "Formato antigo, mantido até o app migrar: uma pergunta isolada (até 2000 caracteres)" }
      ],
      responses: {
        "200": {
          description: "Resposta da IA gerada com sucesso",
          example: { message: "Olá! Posso ajudar você com dicas de viagem..." }
        },
        "400": { description: "Sem messages nem prompt, ou mensagens inválidas", example: { error: "A última mensagem deve ser do usuário.", code: "INVALID_INPUT" } },
        ...messageErrors,
        ...aiErrors
      }
    },
    {
      method: "GET",
      path: "/api/weather",
      summary: "Obter condições meteorológicas",
      description: "Clima atual da WeatherAPI (current.json, via HTTPS), repassado sem alterações.",
      parameters: [
        { name: "latitude", type: "number", required: true, description: "Latitude entre -90 e 90" },
        { name: "longitude", type: "number", required: true, description: "Longitude entre -180 e 180" }
      ],
      responses: {
        "200": {
          description: "JSON da WeatherAPI",
          example: { location: { name: "Cidade" }, current: { temp_c: 25, condition: { text: "Partly cloudy" }, humidity: 65 } }
        },
        "400": { description: "Coordenadas ausentes ou fora do intervalo", example: { error: "Latitude e longitude são obrigatórias.", code: "INVALID_INPUT" } },
        "405": { description: "Método não permitido (apenas GET)", example: { error: "Método não permitido. Use GET." } },
        "502": { description: "Falha na WeatherAPI", example: { error: "Não foi possível consultar o clima agora.", code: "WEATHER_UNAVAILABLE" } },
        "503": { description: "WEATHER não configurada", example: { error: "Serviço de clima indisponível.", code: "WEATHER_UNAVAILABLE" } }
      }
    },
    {
      method: "GET",
      path: "/api/passportVisa",
      summary: "Consultar informações de visto",
      description: "Consulta o serviço externo rough-sun-2523.fly.dev (sem SLA). Só devolve 200 quando a resposta traz category.code; qualquer falha vira 503 VISA_UNAVAILABLE.",
      parameters: [
        { name: "origin", type: "string", required: true, description: "País de origem, código ISO 3166-1 alfa-2 (ex.: BR)" },
        { name: "destination", type: "string", required: true, description: "País de destino, código ISO 3166-1 alfa-2 (ex.: PT)" }
      ],
      responses: {
        "200": {
          description: "Resposta do serviço externo, com category.code validado (demais campos repassados)",
          example: { category: { code: "VR" } }
        },
        "400": { description: "Código de país ausente ou fora do padrão ISO alfa-2", example: { error: "origin deve ser um código de país ISO com 2 letras (ex.: BR).", code: "INVALID_INPUT" } },
        "405": { description: "Método não permitido (apenas GET)", example: { error: "Método não permitido. Use GET." } },
        "503": { description: "Serviço de vistos indisponível ou resposta inválida", example: { error: "Não foi possível consultar o visto agora.", code: "VISA_UNAVAILABLE" } }
      }
    },
    {
      method: "GET",
      path: "/api/itineraryQuote",
      summary: "Créditos de um roteiro",
      description: "Calcula quantos créditos de IA um roteiro consome antes de gerá-lo (1 a cada 7 dias). Não chama a IA nem consulta saldo; o saldo fica no RevenueCat.",
      parameters: [
        { name: "days", type: "integer", required: true, description: "Quantidade de dias (1 a 28)" }
      ],
      responses: {
        "200": { description: "Cotação", example: { days: 10, credits: 2, daysPerCredit: 7, maxDays: 28 } },
        "400": { description: "days ausente ou fora do intervalo", example: { error: "O parâmetro \"days\" deve ser um número inteiro entre 1 e 28.", code: "INVALID_INPUT" } },
        "405": { description: "Método não permitido (apenas GET)", example: { error: "Método não permitido. Use GET." } }
      }
    },
    {
      method: "GET",
      path: "/api/chatPricing",
      summary: "Preço das mensagens com o Felipe",
      description: "Quantas mensagens cada envio consome. As mensagens são uma moeda virtual no RevenueCat, ganha com anúncios recompensados (5 por anúncio, valor definido no bloco do AdMob).",
      responses: {
        "200": { description: "Custos", example: { textMessage: 1, voiceMessage: 5 } },
        "405": { description: "Método não permitido (apenas GET)", example: { error: "Método não permitido. Use GET." } }
      }
    },
    {
      method: "GET",
      path: "/api/adRewardCallback",
      summary: "Recompensa de anúncio (AdMob SSV)",
      description: "Chamado pelo Google quando o usuário termina um anúncio recompensado. A assinatura ECDSA é conferida com as chaves públicas do AdMob; o user_id (uid do Firebase) recebe reward_amount mensagens no RevenueCat, uma vez por transaction_id. Só blocos em ADMOB_REWARDED_AD_UNIT_IDS e reward_item igual a REVENUECAT_CHAT_CURRENCY creditam.",
      parameters: [
        { name: "ad_unit, reward_amount, reward_item, transaction_id, user_id, signature, key_id", type: "query", required: true, description: "Enviados pelo AdMob; a query não pode ser alterada" }
      ],
      responses: {
        "200": { description: "Creditado ou ignorado (bloco, item ou usuário não configurados)", example: { ok: true, outcome: "credited" } },
        "403": { description: "Assinatura ausente ou inválida", example: { error: "Callback de recompensa inválido.", code: "INVALID_REWARD_CALLBACK" } },
        "503": { description: "RevenueCat indisponível (o AdMob reenvia até 5 vezes) ou recompensas desligadas", example: { error: "Não foi possível registrar a recompensa agora.", code: "REWARD_RETRY" } }
      }
    },
    {
      method: "GET",
      path: "/api/version",
      summary: "Versão publicada",
      description: "Commit, branch e ambiente do deploy atual (variáveis de sistema da Vercel). Fora da Vercel, commit e branch são null.",
      responses: {
        "200": { description: "Versão publicada", example: { commit: "9b514b2...", branch: "master", environment: "production" } },
        "405": { description: "Método não permitido (apenas GET)", example: { error: "Método não permitido. Use GET." } }
      }
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET": return "bg-blue-100 text-blue-800 border-blue-200";
      case "POST": return "bg-green-100 text-green-800 border-green-200";
      case "PUT": return "bg-orange-100 text-orange-800 border-orange-200";
      case "DELETE": return "bg-red-100 text-red-800 border-red-200";
      case "PATCH": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getResponseColor = (code: string) => {
    if (code.startsWith("2")) return "text-green-600 bg-green-50";
    if (code.startsWith("4")) return "text-red-600 bg-red-50";
    if (code.startsWith("5")) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };
  return (
    <div className="w-full max-w-5xl">
      <div className="space-y-4">
        {apiEndpoints.map((endpoint, index) => {
          const accordionId = `accordion-${index}`;
          const isOpen = openAccordions.has(accordionId);

          return (
            <div key={accordionId} className="border border-gray-300 rounded-lg shadow-sm bg-gray-50">
              {/* Header */}
              <button
                onClick={() => toggleAccordion(accordionId)}
                className="w-full px-6 py-4 text-left hover:bg-gray-100 hover:cursor-pointer transition-colors duration-200 flex items-center justify-between rounded-t-lg"
              >
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <span className="font-mono text-sm text-gray-700">{endpoint.path}</span>
                  <span className="text-gray-900 font-medium">{endpoint.summary}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Content */}
              {isOpen && (
                <div className="px-6 pb-6 border-t border-gray-200 bg-white rounded-b-lg">
                  <div className="py-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h4>
                    <p className="text-gray-700 mb-6">{endpoint.description}</p>

                    {/* Parameters */}
                    {endpoint.parameters && endpoint.parameters.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Parâmetros</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nome</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tipo</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Obrigatório</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Descrição</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {endpoint.parameters.map((param, paramIndex) => (
                                <tr key={paramIndex} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 text-sm font-mono text-gray-900">{param.name}</td>
                                  <td className="px-4 py-2 text-sm text-gray-600">{param.type}</td>
                                  <td className="px-4 py-2 text-sm">
                                    {param.required ? (
                                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">obrigatório</span>
                                    ) : (
                                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">opcional</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Responses */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Respostas</h4>
                      <div className="space-y-3">
                        {Object.entries(endpoint.responses).map(([code, response]) => (
                          <div key={code} className={`p-4 rounded-lg border ${getResponseColor(code)}`}>
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-mono text-sm font-semibold">{code}</span>
                              <span className="text-sm">{response.description}</span>
                            </div>
                            {response.example && (
                              <div className="mt-3">
                                <h5 className="text-sm font-medium mb-2">Exemplo:</h5>
                                <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(response.example, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => window.open(`http://localhost:3000${endpoint.path}`, '_blank')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Navegar para rota</span>
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Testar endpoint</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};