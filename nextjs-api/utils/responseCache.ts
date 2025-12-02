// Sistema de cache para respostas similares do Felipe
export interface CachedResponse {
  query: string;
  response: string;
  timestamp: number;
  useCount: number;
}

export class ResponseCache {
  private cache = new Map<string, CachedResponse>();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas
  private readonly MAX_CACHE_SIZE = 100;
  private readonly SIMILARITY_THRESHOLD = 0.8;

  // Respostas pré-definidas para perguntas comuns
  private predefinedResponses = new Map<string, string>([
    // Saudações
    ['oi', 'Olá! Sou o Felipe, seu guia turístico virtual. Como posso ajudar você hoje?'],
    ['olá', 'Oi! Muito prazer, sou o Felipe. Estou aqui para te ajudar com dicas de viagem!'],
    ['hello', 'E aí! Felipe aqui, pronto para te dar as melhores dicas de turismo!'],
    ['bom dia', 'Bom dia! Sou o Felipe, seu guia virtual. Que destino vamos explorar hoje?'],
    ['boa tarde', 'Boa tarde! Felipe aqui, pronto para suas aventuras turísticas!'],
    ['boa noite', 'Boa noite! Mesmo à noite estou aqui para planejar suas viagens!'],
    
    // Agradecimentos
    ['obrigado', 'Por nada! Estou aqui sempre que precisar de dicas de viagem!'],
    ['obrigada', 'De nada! Foi um prazer ajudar. Boa viagem!'],
    ['valeu', 'Sempre às ordens! Qualquer dúvida sobre turismo, pode contar comigo!'],
    ['brigado', 'Imagina! Adoro ajudar com dicas de viagem!'],
    
    // Despedidas
    ['tchau', 'Tchau! Tenha uma ótima viagem e volte sempre que precisar de dicas!'],
    ['até logo', 'Até mais! Estarei aqui quando quiser planejar sua próxima aventura!'],
    ['bye', 'Bye! Boa viagem e lembre-se: o mundo está cheio de lugares incríveis!'],
    
    // Perguntas básicas
    ['quem é você', 'Sou o Felipe, seu guia turístico virtual! Especialista em destinos brasileiros e internacionais.'],
    ['o que você faz', 'Ajudo viajantes com dicas de destinos, roteiros, hospedagem, gastronomia e tudo sobre turismo!'],
    ['como você pode me ajudar', 'Posso sugerir destinos, criar roteiros, dar dicas de economia, indicar atrações e muito mais!'],
  ]);

  // Normalizar texto para comparação
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[áàãâä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòõôö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ');
  }

  // Calcular similaridade entre strings (algoritmo simples)
  private calculateSimilarity(str1: string, str2: string): number {
    const normalized1 = this.normalizeText(str1);
    const normalized2 = this.normalizeText(str2);
    
    if (normalized1 === normalized2) return 1;
    
    const words1 = normalized1.split(' ');
    const words2 = normalized2.split(' ');
    
    let commonWords = 0;
    const totalWords = Math.max(words1.length, words2.length);
    
    for (const word1 of words1) {
      if (words2.includes(word1) && word1.length > 2) {
        commonWords++;
      }
    }
    
    return commonWords / totalWords;
  }

  // Buscar resposta em cache ou respostas pré-definidas
  getCachedResponse(query: string): string | null {
    const normalizedQuery = this.normalizeText(query);
    
    // 1. Verificar respostas pré-definidas primeiro
    for (const [key, response] of this.predefinedResponses) {
      if (this.calculateSimilarity(normalizedQuery, key) >= this.SIMILARITY_THRESHOLD) {
        //DEBUG: console.log(`Cache hit (predefinido): "${query}" → "${key}"`);
        return response;
      }
    }
    
    // 2. Verificar cache de respostas dinâmicas
    const now = Date.now();
    
    for (const [cachedKey, cached] of this.cache) {
      // Verificar se não expirou
      if (now - cached.timestamp > this.CACHE_TTL) {
        this.cache.delete(cachedKey);
        continue;
      }
      
      // Verificar similaridade
      if (this.calculateSimilarity(normalizedQuery, this.normalizeText(cached.query)) >= this.SIMILARITY_THRESHOLD) {
        cached.useCount++;
        //DEBUG: console.log(`Cache hit (dinâmico): "${query}" → "${cached.query}" (usado ${cached.useCount}x)`);
        return cached.response;
      }
    }
    
    console.log(`Cache miss: "${query}"`);
    return null;
  }

  // Armazenar nova resposta no cache
  storeResponse(query: string, response: string): void {
    // Não armazenar se for muito similar a respostas pré-definidas
    const normalizedQuery = this.normalizeText(query);
    for (const key of this.predefinedResponses.keys()) {
      if (this.calculateSimilarity(normalizedQuery, key) >= this.SIMILARITY_THRESHOLD) {
        //DEBUG: console.log(`Não armazenando no cache: muito similar a resposta pré-definida`);
        return;
      }
    }
    
    // Limpar cache se estiver muito cheio
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.cleanOldEntries();
    }
    
    const cacheKey = normalizedQuery;
    this.cache.set(cacheKey, {
      query,
      response,
      timestamp: Date.now(),
      useCount: 1
    });
    
    //DEBUG: console.log(`Resposta armazenada no cache: "${query}"`);
  }

  // Limpar entradas antigas do cache
  private cleanOldEntries(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    // Ordenar por: menos usado e mais antigo
    entries.sort((a, b) => {
      const scoreA = a[1].useCount * 1000 - (now - a[1].timestamp);
      const scoreB = b[1].useCount * 1000 - (now - b[1].timestamp);
      return scoreA - scoreB;
    });
    
    // Remover 20% das entradas menos úteis
    const toRemove = Math.floor(this.cache.size * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
    
    //DEBUG: console.log(`Cache limpo: ${toRemove} entradas removidas`);
  }

  // Estatísticas do cache
  getStats(): { size: number; hitRate: number; predefinedCount: number } {
    const totalUses = Array.from(this.cache.values()).reduce((sum, cached) => sum + cached.useCount, 0);
    return {
      size: this.cache.size,
      hitRate: totalUses > 0 ? totalUses / (totalUses + this.cache.size) : 0,
      predefinedCount: this.predefinedResponses.size
    };
  }

  // Limpar todo o cache
  clear(): void {
    this.cache.clear();
    //DEBUG: console.log('Cache completamente limpo');
  }
}

// Instância singleton do cache
export const responseCache = new ResponseCache();