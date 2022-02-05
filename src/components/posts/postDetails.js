import React from "react";
import { View } from "react-native";

import SearchGame from "../game/searchGame";
import SelectedGame from "../game/selectedGame";
import PostTitle from "./postTitle";

const PostDetails = ({
  title,
  setTitle,
  game,
  setGame,
  tags,
  setTags,
  disable,
}) => {
  // Only take and return values that post uses
  const [showSearchBar, setShowSearchBar] = React.useState(false);
  const [showTags, setShowTags] = React.useState(false);

  const onSelectGame = (newSelectedGame) => {
    setGame(newSelectedGame);
    setShowSearchBar(false);
  };

  const onRemoveGame = () => {
    if (disable) return;
    setGame(null);
    setShowSearchBar(true);
  };

  return showTags ? (
    <View />
  ) : (
    <View>
      <PostTitle title={title} onChangeTitle={setTitle} disable={disable} />
      {game && <SelectedGame selectedGame={game} onRemoveGame={onRemoveGame} />}
      {showSearchBar && (
        <SearchGame onSelectGame={onSelectGame} disable={disable} />
      )}
    </View>
  );
};

export default PostDetails;
