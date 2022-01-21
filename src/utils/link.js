import * as Linking from "expo-linking";

export const openURL = async (URL) => {
  try {
    Linking.openURL(URL);
  } catch (error) {
    console.log(error);
  }
};

export const getFlagLink = (country_code) =>
  `https://cdn.shinobi.cc/flags/${country_code.toLowerCase()}.png`;
