import { NextApiRequest, NextApiResponse } from "next";
import client from "@/client";

export default async function accounts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.VESSEL_API_KEY) {
    throw new Error("Missing VESSEL_API_KEY environment variable");
  }
  const { id: userId } = JSON.parse(req.body);
  const { accounts, cursor } = await client({ userId }).accounts();
  res.json({ accounts, cursor });
}
