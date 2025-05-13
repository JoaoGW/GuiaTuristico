export async function reverseGeocodeWithNominatim(latitude: number, longitude: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    const city = data.address?.city || data.address?.town || data.address?.village || 'Cidade desconhecida';
    const neighborhood = data.address?.suburb || data.address?.neighbourhood || 'Bairro desconhecido';

    return { city, neighborhood };
  } catch (error) {
    console.error('Erro na geocodificação reversa:', error);
    throw error;
  }
}