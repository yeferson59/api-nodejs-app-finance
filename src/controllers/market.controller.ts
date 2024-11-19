import Market from "@/models/market.model";
import { Request, Response } from "express";
import { z } from "zod";

export const getStock = async (req: Request, res: Response) => {
  const { ticket } = req.params;
  const { success, error, data } = await z
    .string()
    .min(1)
    .max(8)
    .trim()
    .safeParseAsync(ticket.toLocaleUpperCase());
  if (!success) {
    res.status(400).json({ errors: error.flatten().formErrors });
    return;
  }
  const stock = await Market.getStock(data);
  res.json(stock);
};
