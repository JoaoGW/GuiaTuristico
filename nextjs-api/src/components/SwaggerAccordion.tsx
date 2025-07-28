// Este componente foi criado pelo Claude Sonnet 4 por fins de teste deste modelo de IA
"use client";

import { useState } from "react";

interface ApiEndpoint {
  method: string;
  path: string;
  summary: string;
  description: string;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  responses: { [key: string]: { description: string; example?: any } };
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
  const apiEndpoints: ApiEndpoint[] = [
    {
      method: "POST",
      path: "/api/voiceChat",
      summary: "Chat por voz unificado",
      description: "Endpoint unificado que combina transcrição de áudio (Whisper) + resposta da IA (GPT-3.5-turbo) em uma única chamada. Inclui sistema de cache inteligente para reduzir custos com a OpenAI.",
      parameters: [
        { name: "audio", type: "file", required: true, description: "Arquivo de áudio (máx. 2MB, ~15 segundos). Formatos: WAV, MP3, M4A, etc." }
      ],
      responses: {
        "200": {
          description: "Processamento completo realizado com sucesso",
          example: {
            transcribedText: "Quais são as melhores atrações do Rio de Janeiro?",
            response: "O Rio de Janeiro oferece diversas atrações incríveis como Cristo Redentor, Pão de Açúcar...",
            fromCache: false,
            audioInfo: {
              originalName: "audio.m4a",
              size: 1024000
            }
          }
        },
        "400": { 
          description: "Arquivo inválido ou muito grande",
          example: {
            error: "Arquivo de áudio é obrigatório",
            details: "Envie o arquivo com o campo 'audio'"
          }
        },
        "413": { 
          description: "Arquivo muito grande (>2MB)",
          example: {
            error: "Arquivo muito grande",
            details: "O arquivo deve ter no máximo 2MB (equivale a ~15 segundos)",
            maxSize: "2MB"
          }
        },
        "500": { description: "Erro interno ou falha na API da OpenAI" }
      }
    },
    {
      method: "POST", 
      path: "/api/chat",
      summary: "Chat com IA (texto)",
      description: "Endpoint de chat baseado em texto usando OpenAI GPT-3.5-turbo. Integrado com sistema de cache inteligente para otimizar custos e performance.",
      parameters: [
        { name: "message", type: "string", required: true, description: "Mensagem ou pergunta para a IA sobre turismo" }
      ],
      responses: {
        "200": {
          description: "Resposta da IA gerada com sucesso",
          example: {
            response: "Baseado na sua localização, recomendo visitar o museu histórico local...",
            fromCache: true
          }
        },
        "400": { 
          description: "Mensagem não fornecida",
          example: {
            error: "Mensagem é obrigatória"
          }
        },
        "405": { description: "Método não permitido (apenas POST)" },
        "500": { description: "Falha ao gerar resposta da IA" }
      }
    },
    {
      method: "GET",
      path: "/api/cacheStats",
      summary: "Estatísticas do cache",
      description: "Retorna estatísticas detalhadas do sistema de cache, incluindo taxa de acertos, economia de custos e total de requisições processadas.",
      responses: {
        "200": {
          description: "Estatísticas do cache retornadas com sucesso",
          example: {
            totalRequests: 150,
            cacheHits: 45,
            cacheMisses: 105,
            hitRate: "30.00%",
            estimatedSavings: "$2.25",
            cacheSize: 12,
            oldestEntry: "2025-01-20T10:30:00.000Z",
            newestEntry: "2025-01-20T14:45:00.000Z"
          }
        },
        "405": { description: "Método não permitido (apenas GET)" },
        "500": { description: "Erro ao obter estatísticas do cache" }
      }
    },
    {
      method: "POST",
      path: "/api/generateItinerary",
      summary: "Gerar itinerário de viagem",
      description: "Gera um itinerário personalizado usando OpenAI GPT-3.5-turbo baseado nas preferências pessoais setadas pelo usuário, localização desejada e budget máximo estipulado.",
      parameters: [
        { name: "prompt", type: "string", required: true, description: "Prompt com preferências e detalhes da viagem desejada" }
      ],
      responses: {
        "200": {
          description: "Itinerário gerado com sucesso",
          example: {
            message: "Dia 1: Visite o Cristo Redentor pela manhã..."
          }
        },
        "405": { description: "Método não permitido (apenas POST)" },
        "500": { description: "Falha ao gerar resposta da IA" }
      }
    },
    {
      method: "GET",
      path: "/api/googlePhotoProxy",
      summary: "Proxy para fotos do Google Places",
      description: "Busca e retorna imagens de lugares através da API do Google Places usando photo_reference",
      parameters: [
        { name: "photo_reference", type: "string", required: true, description: "Referência da foto obtida via Google Places API" }
      ],
      responses: {
        "200": { description: "Imagem retornada com sucesso (content-type: image/jpeg)" },
        "400": { description: "photo_reference é obrigatório ou erro ao buscar imagem" }
      }
    },
    {
      method: "GET",
      path: "/api/googlePlacesApi",
      summary: "Buscar lugares próximos",
      description: "Busca restaurantes próximos usando a API do Google Places baseado em coordenadas geográficas",
      parameters: [
        { name: "latitude", type: "number", required: true, description: "Latitude da localização" },
        { name: "longitude", type: "number", required: true, description: "Longitude da localização" }
      ],
      responses: {
        "200": {
          description: "Lista de lugares próximos retornada com sucesso",
          example: {
            places: [
              { name: "Restaurante Exemplo", rating: 4.5, vicinity: "Rua das Flores, 123" }
            ]
          }
        },
        "400": { description: "Latitude e longitude são obrigatórios" },
        "405": { description: "Método não permitido (apenas GET)" },
        "500": { description: "Falha ao buscar lugares próximos" }
      }
    },
    {
      method: "POST",
      path: "/api/justchat",
      summary: "Chat simples com IA",
      description: "Endpoint de chat simples usando OpenAI GPT-3.5-turbo para conversas gerais sobre turismo",
      parameters: [
        { name: "prompt", type: "string", required: true, description: "Mensagem ou pergunta para a IA" }
      ],
      responses: {
        "200": {
          description: "Resposta da IA gerada com sucesso",
          example: {
            message: "Olá! Posso ajudar você com dicas de viagem..."
          }
        },
        "405": { description: "Método não permitido (apenas POST)" },
        "500": { description: "Falha ao gerar resposta da IA" }
      }
    },
    {
      method: "GET",
      path: "/api/weather",
      summary: "Obter condições meteorológicas",
      description: "Retorna informações meteorológicas atuais para uma localização específica usando WeatherAPI",
      parameters: [
        { name: "latitude", type: "number", required: true, description: "Latitude da localização" },
        { name: "longitude", type: "number", required: true, description: "Longitude da localização" }
      ],
      responses: {
        "200": {
          description: "Informações meteorológicas retornadas com sucesso",
          example: {
            current: {
              temp_c: 25,
              condition: { text: "Partly cloudy" },
              humidity: 65
            }
          }
        },
        "400": { description: "Latitude e longitude são obrigatórios" },
        "405": { description: "Método não permitido (apenas GET)" },
        "500": { description: "Falha ao buscar informações meteorológicas" }
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