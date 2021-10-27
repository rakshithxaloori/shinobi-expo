import axios from "axios";
import * as SecureStore from "expo-secure-store";

let API_ENDPOINT = undefined;
if (process.env.CI_CD_STAGE === "production")
  API_ENDPOINT = `https://${process.env.BASE_API_ENDPOINT}/`;
else API_ENDPOINT = `http://${process.env.BASE_API_ENDPOINT}/`;

// Create axios client, pre-configured with baseURL
export const createAPIKit = async () => {
  let APIKit = axios.create({
    baseURL: API_ENDPOINT,
    timeout: 10000,
    headers: { "X-Api-Key": process.env.API_KEY },
  });
  try {
    const token_key = await SecureStore.getItemAsync("token_key");
    if (token_key === undefined || token_key === null) return APIKit;
    APIKit.defaults.headers.common["Authorization"] = `Token ${token_key}`;
  } catch (error) {
    console.log("TOKEN NOT FOUND");
  }
  return APIKit;
};
