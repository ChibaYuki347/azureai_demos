"use server"

import axios from "axios";

export interface TokenResponse {
  authToken: string;
  region: string;
}

export async function getTokenOrRefresh(): Promise<TokenResponse> {
  const speechKey = process.env.SPEECH_KEY;
  const speechRegion = process.env.SPEECH_REGION;
  if (!speechKey || !speechRegion) {
    throw new Error("Missing speech key or region");
  }
  const headers = {
        'Ocp-Apim-Subscription-Key': speechKey,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
  try {
    const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {}, { headers });
    const data = {authToken: tokenResponse.data,region: speechRegion}
    console.log(data)
    return data
  }  catch (e) {
    console.error(e);
    throw e;
  }
  
}
