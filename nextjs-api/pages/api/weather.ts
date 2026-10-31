import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentWeather } from "@/contexts/catalog/application/getCurrentWeather";
import { ensureMethod, readQueryParam, sendError } from "@/shared/http";

export default async function CurrentWeather(req: NextApiRequest, res: NextApiResponse){
  if (!ensureMethod(req, res, ["GET"])) return;

  try {
    const data = await getCurrentWeather(readQueryParam(req.query.latitude), readQueryParam(req.query.longitude));
    return res.status(200).json(data);
  } catch (error) {
    return sendError(res, error, "Erro ao consultar o clima");
  }
}
