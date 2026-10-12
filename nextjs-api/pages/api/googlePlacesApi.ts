import type { NextApiRequest, NextApiResponse } from 'next';

interface PlacePhoto {
  photo_reference: string;
  photo_url?: string;
  [key: string]: unknown;
}

interface Place {
  name: string;
  photos?: PlacePhoto[];
  [key: string]: unknown;
}

interface GooglePlacesResponse {
  results: Place[];
  error_message?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const radius = 1500;
    const type = 'tourist_attraction';
    
    // Verificar se a chave está sendo carregada
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    // DEBUG: console.log('API Key loaded:', apiKey ? `Yes (${apiKey.substring(0, 10)}...)` : 'NO - KEY MISSING!');

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;

    const response = await fetch(url);
    const data: GooglePlacesResponse = await response.json();

    // Log detalhado para debug
    // DEBUG: console.log('Google Places API Response Status:', data.error_message || 'OK');
    // DEBUG: console.log('Full response:', JSON.stringify(data).substring(0, 200));
    
    if (data.error_message) {
      console.error('Google Places API Error:', data.error_message);
      return res.status(500).json({ error: data.error_message, details: 'Google API returned an error' });
    }

    if (!data.results) {
      console.error('No results field in response:', data);
      return res.status(500).json({ error: 'Invalid response from Google Places API' });
    }

    // Processar os resultados para incluir URLs de fotos
    const processedResults = data.results.map((place) => {
      if (place.photos && place.photos.length > 0) {
        const photoReference = place.photos[0].photo_reference;
        // Usar Place Photos API para obter URL completa da foto
        place.photos[0].photo_url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${apiKey}`;
        // DEBUG: console.log(`Photo URL for ${place.name}:`, place.photos[0].photo_url.substring(0, 100));
      } else {
        // DEBUG: console.log(`No photos for place: ${place.name}`);
      }
      return place;
    });

    // DEBUG: console.log(`Returning ${processedResults.length} places with photos processed`);

    // Retornar no formato esperado pelo frontend
    res.status(200).json({ results: processedResults });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    console.error('Failed to fetch nearby places:', message);
    res.status(500).json({ error: 'Failed to fetch nearby places', details: message });
  }
}