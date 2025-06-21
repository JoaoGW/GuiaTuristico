// Use this method to request the OpenAI API to generate a travel itinerary
export const generateItinerary = async (prompt: string) => {
  try {
    const response = await fetch(`http://<SEU-IP-AQUI>:3000/api/generateItinerary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      if(response?.status === 429){
        console.log("O limite da cota foi atingido. Verifique o saldo disponível na OpenAI.");
      }
      console.log("Status da Resposta da OpenAI: ", response);
      throw new Error('Falha ao gerar o itinerário');
    }

    const data = await response.json();

    return data.message;
  } catch (error) {
    console.error('O seguinte erro foi encontrado ao gerar o itinerário: ', error);
    throw error;
  }
}

export const generateChatAnswers = async (prompt: string) => {
  try {
    const response = await fetch(`http://<SEU-IP-AQUI>:3000/api/justchat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      if(response?.status === 429){
        console.log("O limite da cota foi atingido. Verifique o saldo disponível na OpenAI.");
      }
      console.log("Status da Resposta da OpenAI: ", response);
      throw new Error('Falha ao gerar o itinerário');
    }

    const data = await response.json();

    return data.message;
  } catch (error) {
    console.error('O seguinte erro foi encontrado ao gerar o itinerário: ', error);
    throw error;
  }
}