import type { NextApiRequest, NextApiResponse } from "next";

export default async function CurrentWeather(req: NextApiRequest, res: NextApiResponse){
  const weatherApi = process.env.WEATHER;
  const { latitude, longitude } = req.query;

  if (req.method === "GET") {
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude e longitude são obrigatórios" });
    }
    
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${weatherApi}&q=${latitude},${longitude}&aqi=no`)

      console.log("Latitude:", latitude, "Longitude:", longitude);

      if(!response.ok){
        throw new Error ("Failed to fetch weather information");
      }

      const data = await response.json();

      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching weather information: ", error);
      res.status(500).json({ error: "Failed to fetch a response from weather" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}