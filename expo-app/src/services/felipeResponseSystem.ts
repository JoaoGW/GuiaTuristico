/**
 * The `FelipeResponseSystem` class is a virtual tour guide system that generates
 * responses based on user input. It provides recommendations and tips for travel,
 * including destinations, activities, and general advice.
 *
 * @class
 *
 * @property {Object} responses - A collection of predefined responses categorized
 * into various topics such as greetings, destinations, beaches, adventure, culture,
 * food, tips, and fallback responses.
 *
 * @property {Object} keywords - A mapping of categories to arrays of keywords used
 * to identify the user's intent from their input message.
 *
 * @method generateResponse
 * @description Generates a response based on the user's input message by matching
 * keywords to predefined categories. If no keywords match, a fallback response is
 * returned.
 * 
 * @param {string} userMessage - The input message from the user.
 * @returns {string} A response string selected from the appropriate category or
 * a fallback response if no category matches.
 */
export class FelipeResponseSystem {
  private responses = {
    // Saudações
    greeting: [
      "Olá! Sou o Felipe, seu guia turístico virtual. Como posso ajudar você hoje?",
      "Oi! Muito prazer, sou o Felipe. Estou aqui para te ajudar com dicas de viagem!",
      "E aí! Felipe aqui, pronto para te dar as melhores dicas de turismo!"
    ],

    // Destinos no Brasil
    brazil: [
      "O Brasil tem destinos incríveis! Praias no Nordeste, montanhas em Minas, Pantanal, Amazônia... Que tipo de experiência você busca?",
      "Que maravilha! O Brasil é gigantesco. Rio de Janeiro, Salvador, Florianópolis, Foz do Iguaçu... Qual região te interessa mais?",
      "Excelente escolha! Temos desde praias paradisíacas até aventuras na natureza. Me conta mais sobre seu perfil de viagem!"
    ],

    // Praias
    beaches: [
      "Para praias, recomendo Nordeste! Jericoacoara, Porto de Galinhas, Morro de São Paulo... Águas quentes e cenários de cartão postal!",
      "Praia é comigo mesmo! Costa do Sauípe, Arraial d'Ajuda, Praia do Forte... Quando pretende viajar?",
      "Praias brasileiras são espetaculares! Búzios, Ilhabela, Bombinhas... Prefere agito ou sossego?"
    ],

    // Aventura
    adventure: [
      "Para aventura, Chapada Diamantina, Bonito, Serra da Canastra são perfeitos! Trilhas, cachoeiras e natureza selvagem!",
      "Que legal! Pantanal para ver onças, Lençóis Maranhenses, rapel na Chapada... Que tipo de aventura te empolga?",
      "Aventura é minha especialidade! Amazônia, Jalapão, Serra do Rio do Rastro... Preparado para a adrenalina?"
    ],

    // Cultura/História
    culture: [
      "Para cultura, Ouro Preto, Pelourinho em Salvador, São Luís... Cada cidade conta séculos de história brasileira!",
      "Cultura brasileira é riquíssima! Paraty, Diamantina, Olinda... Museus, arquitetura colonial e tradições vivas!",
      "Excelente! Brasília, centros históricos de Minas, festas populares... O Brasil cultural é fascinante!"
    ],

    // Comida
    food: [
      "A gastronomia brasileira é incrível! Feijoada no Rio, acarajé na Bahia, pirarucu na Amazônia... Que delícia!",
      "Comida boa demais! Cada região tem seus pratos típicos. Minas com pão de açúcar, Ceará com tapioca...",
      "Que fome! Churrasco no Sul, vatapá no Nordeste, pequi no Centro-Oeste... O Brasil é um festival gastronômico!"
    ],

    // Dicas gerais
    tips: [
      "Dica do Felipe: sempre leve protetor solar, repelente e uma garrafinha d'água. O Brasil é tropical!",
      "Importante: verifique a época das chuvas no destino. Cada região tem seu melhor período para visitar!",
      "Lembre-se: Brasil é continental! Sempre tenha um tempo extra para deslocamentos entre cidades."
    ],

    // Fallback - quando não entende
    fallback: [
      "Interessante! Me conta mais detalhes para eu dar dicas mais específicas.",
      "Que legal! Pode explicar melhor o que você tem em mente? Assim posso ajudar melhor!",
      "Ótima pergunta! Me dê mais informações para eu dar as melhores dicas de viagem.",
      "Adorei sua ideia! Compartilha mais detalhes para eu montar um roteiro perfeito!"
    ]
  };

  private keywords = {
    greeting: ['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'eai', 'hello'],
    brazil: ['brasil', 'brasileiro', 'nacional', 'domestico', 'interior'],
    beaches: ['praia', 'mar', 'costa', 'litoral', 'sol', 'areia', 'banho de mar'],
    adventure: ['aventura', 'trilha', 'natureza', 'cachoeira', 'montanha', 'escalada', 'rapel'],
    culture: ['cultura', 'história', 'museu', 'histórico', 'colonial', 'patrimônio'],
    food: ['comida', 'gastronomia', 'prato', 'culinária', 'restaurante', 'comer'],
    tips: ['dica', 'conselho', 'sugestão', 'importante', 'cuidado']
  };

  generateResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    // Verificar cada categoria de palavras-chave
    for (const [category, keywords] of Object.entries(this.keywords)) {
      const hasKeyword = keywords.some(keyword => message.includes(keyword));
      if (hasKeyword) {
        const responses = this.responses[category as keyof typeof this.responses];
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
      }
    }

    // Se não encontrou palavras-chave específicas, usar fallback
    const fallbackResponses = this.responses.fallback;
    const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
    return fallbackResponses[randomIndex];
  }
}

export const felipeSystem = new FelipeResponseSystem();