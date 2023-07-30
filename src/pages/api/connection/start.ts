import { NextApiRequest, NextApiResponse } from "next";

export default async function start(_: NextApiRequest, res: NextApiResponse) {
  if (!process.env.VESSEL_API_KEY) {
    throw new Error("Missing VESSEL_API_KEY environment variable");
  }
  const response = await fetch(
    "https://app.vessel.dev/api/auth/session-token",
    {
      headers: {
        "Content-Type": "application/json",
        "x-vessel-api-token": process.env.VESSEL_API_KEY ?? "",
      },
      method: "POST",
    }
  );

  // NOTE: The session token is within the result object.
  const {
    result: { sessionToken },
  } = await response.json();

  res.json({ sessionToken });
}
