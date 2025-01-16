import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // URL: /api/twitch/
  res.status(200).json({
    error: "Incorrect syntax",
    syntax: "/discord/username/{username}",
  });
}
