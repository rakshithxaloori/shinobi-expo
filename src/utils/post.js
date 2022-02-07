import { MAX_TITLE_LENGTH } from ".";
import { flashAlert } from "./flash_message";

export const checkTitle = (title) => {
  if (title === "") {
    flashAlert("Title can't be empty");
    return false;
  }
  if (title.length > MAX_TITLE_LENGTH) {
    flashAlert("Title has to be shorter than");
    return false;
  }
  return true;
};

export const checkGame = (game) => {
  // Check game.id
  if (game === null || game?.id === null || game?.id === undefined) {
    flashAlert("Select a game");
    return false;
  }
  return true;
};
