import type { NextApiRequest, NextApiResponse } from 'next';

interface Place {
  name: string;
  [key: string]: any; // Add more fields as needed
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
    const radius = 500; // Radius in meters
    const type = 'restaurant';

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data: GooglePlacesResponse = await response.json();

    if (data.error_message) {
      return res.status(500).json({ error: data.error_message });
    }

    res.status(200).json({ places: data.results || [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nearby places' });
  }
}