/**
 * Use this method to request the OpenAI API to generate a travel itinerary
 * Generates an itinerary based on the provided prompt by making a POST request
 * to the specified API endpoint.
 *
 * @param prompt - A string containing the input prompt to generate the itinerary.
 * @returns A promise that resolves to the generated itinerary message as a string.
 * @throws Will throw an error if the request fails or the response is not successful.
 *
 * @remarks
 * - Ensure that the API endpoint (`http://SEU-IP-AQUI:3000/api/generateItinerary`) is accessible.
 * - If the response status is 429, it indicates that the quota limit has been reached.
 * - Logs relevant information to the console in case of errors or specific response statuses.
 */
export const generateItinerary = async (prompt: string) => {
  try {
    const response = await fetch(`http://SEU-IP-AQUI:3000/api/generateItinerary`, {
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

/**
 * Sends a prompt to the specified API endpoint and retrieves a generated chat response.
 *
 * @param prompt - The input string to be sent to the API for generating a response.
 * @returns A promise that resolves to the generated chat response message.
 * @throws Will throw an error if the API request fails or the response status is not OK.
 *
 * @remarks
 * - Ensure that the API endpoint (`http://SEU-IP-AQUI:3000/api/justchat`) is correctly configured.
 * - If the API returns a 429 status code, it indicates that the quota limit has been reached.
 * - Logs relevant error messages to the console for debugging purposes.
 */
export const generateChatAnswers = async (prompt: string) => {
  try {
    const response = await fetch(`http://SEU-IP-AQUI:3000/api/justchat`, {
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