import * as Linking from "expo-linking";

export const openURL = async (URL) => {
  try {
    Linking.openURL(URL);
  } catch (error) {
    console.log(error);
  }
};
