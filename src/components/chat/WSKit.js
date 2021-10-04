import * as SecureStore from "expo-secure-store";

let WS_ENDPOINT = undefined;
if (process.env.CI_CD_STAGE === "production")
  WS_ENDPOINT = `wss://${process.env.BASE_API_ENDPOINT}/ws/chat`;
else WS_ENDPOINT = `ws://${process.env.BASE_API_ENDPOINT}/ws/chat`;

export const createWSKit = async (chatID) => {
  try {
    const token_key = await SecureStore.getItemAsync("token_key");
    const chatSocket = new WebSocket(`${WS_ENDPOINT}/${chatID}/`, token_key);
    return chatSocket;
  } catch (error) {
    console.log("TOKEN NOT FOUND");
    return undefined;
  }
};
