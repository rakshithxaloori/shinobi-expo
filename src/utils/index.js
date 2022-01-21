import axios from "axios";
import { flashAlert } from "./flash_message";

export const FLAG_ASPECT_RATIO = 1.4;

export const dateTimeDiff = (dateThen) => {
  const dateNow = new Date();
  let dateDiff = dateNow.getTime() - dateThen.getTime();

  if (Math.floor(dateDiff / (1000 * 3600 * 24 * 365)) > 0)
    dateDiff = `${Math.floor(dateDiff / (1000 * 3600 * 24 * 365))}y`;
  else if (Math.floor(dateDiff / (1000 * 3600 * 24 * 30)) > 0)
    dateDiff = `${Math.floor(dateDiff / (1000 * 3600 * 24 * 30))}mo`;
  else if (Math.floor(dateDiff / (1000 * 3600 * 24)) > 0)
    dateDiff = `${Math.floor(dateDiff / (1000 * 3600 * 24))}d`;
  else if (Math.floor(dateDiff / (1000 * 3600)) > 0)
    dateDiff = `${Math.floor(dateDiff / (1000 * 3600))}h`;
  else if (Math.floor(dateDiff / (1000 * 60)) > 0)
    dateDiff = `${Math.floor(dateDiff / (1000 * 60))}mi`;
  else dateDiff = `${Math.floor(dateDiff / 1000)}s`;

  return dateDiff;
};

const createErrorStr = (error) => {
  console.log("NETWORK ERROR");
  if (error.response) {
    // Request made and server responded
    console.log("ERROR DATA", error.response.data);
    console.log("ERROR STATUS", error.response.status);
    if (error.response.status >= 500) return "Server Error";
    else return error.response.data.detail;
  } else if (error.request) {
    // The request was made but no response was received
    console.log("The request was made but no response was received");
    return "No Internet Connection";
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("ERROR MESSAGE", error.message);
    return error.message;
  }
};

export const handleAPIError = (error, flash = true) => {
  if (!axios.isCancel(error)) {
    const errorStr = createErrorStr(error);
    if (flash) {
      flashAlert(errorStr);
    }
    return errorStr;
  }
};
