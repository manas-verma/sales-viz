import { NextApiRequest, NextApiResponse } from "next";
import db from "@/db";

export default async function deleteConnection(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.body;

  if (!process.env.VESSEL_API_KEY) {
    throw new Error("Missing VESSEL_API_KEY environment variable");
  }

  const connectionId = db.getConnectionId({ userId });
  await fetch("https://app.vessel.dev/api/connections/delete", {
    headers: {
      "Content-Type": "application/json",
      "x-vessel-api-token": process.env.VESSEL_API_KEY ?? "",
    },
    method: "POST",
    body: JSON.stringify({
      id: connectionId,
    }),
  });

  await db.saveAccessToken({ userId, connectionId: null, accessToken: null });

  res.send({ success: true });
}
