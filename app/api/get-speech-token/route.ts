import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const speechKey = process.env.SPEECH_KEY;
  const speechRegion = process.env.SPEECH_REGION;

  if (speechKey === undefined || speechRegion === undefined) {
    return new Response(
      "You forgot to add your speech key or region to the .env file.",
      {
        status: 400,
      }
    );
  }
  const headers = {
    headers: {
      "Ocp-Apim-Subscription-Key": speechKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const tokenResponse = await axios.post(
      `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      null,
      headers
    );
    return res.json({ token: tokenResponse.data, region: speechRegion });
  } catch (err) {
    res.json("There was an error authorizing your speech key.");
  }
}
