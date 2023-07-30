import { NextApiRequest, NextApiResponse } from "next";
import db from "@/db";

export default async function complete(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, sessionToken } = req.body;

  if (!process.env.VESSEL_API_KEY) {
    throw new Error("Missing VESSEL_API_KEY environment variable");
  }
  if (!userId || !sessionToken) {
    throw new Error("Missing userId or sessionToken");
  }

  const response = await fetch("https://app.vessel.dev/api/auth/access-token", {
    headers: {
      "Content-Type": "application/json",
      "x-vessel-api-token": process.env.VESSEL_API_KEY ?? "",
      "x-vessel-session-token": sessionToken,
    },
    method: "POST",
  });

  const json = await response.json();
  const { connectionId, accessToken } = json.result;

  // !!IMPORTANT!! Make sure to store the connectionId and accessToken securely
  await db.saveAccessToken({ userId, connectionId, accessToken });

  res.send({ success: true });
}
