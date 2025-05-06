// Use this method to request the OpenAI API to generate a travel itinerary
export const generateItinerary = async (location: string, preferences: string, budget: string) => {
  const prompt = `Gere recomendações de um roteiro turístico, leve em consideração que sou uma pessoa que gosta de ${preferences}. Além disso, estou localizado em: ${location} e meu orçamento é de: ${budget}.`

  try {
    const response = await fetch('/api/generateItinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate itinerary');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
}