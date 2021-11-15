import axios from "axios";
import { flashAlert } from "./flash_message";

export const create_UUID = () => {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};
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

export const createErrorStr = (error) => {
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

export const handleAPIError = (error) => {
  if (!axios.isCancel(error)) {
    const errorStr = createErrorStr(error);
    flashAlert(errorStr);
    return errorStr;
  } else return "";
};
