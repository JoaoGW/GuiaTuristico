import { NextApiRequest, NextApiResponse } from "next";
import { checkVisa } from "@/contexts/itinerary/application/checkVisa";
import { ensureMethod, readQueryParam, sendError } from "@/shared/http";

export default async function PassportVisa(req: NextApiRequest, res: NextApiResponse){
  if (!ensureMethod(req, res, ["GET"])) return;

  try {
    const data = await checkVisa(readQueryParam(req.query.origin), readQueryParam(req.query.destination));
    return res.status(200).json(data);
  } catch (error) {
    return sendError(res, error, "Erro ao consultar informações de visto");
  }
}
