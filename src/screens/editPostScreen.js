import React from "react";

import { handleAPIError } from "../utils";
import { createAPIKit } from "../utils/APIKit";
import { flashAlert } from "../utils/flash_message";
import PostDetails from "../components/posts/postDetails";
import { checkGame, checkTitle } from "../utils/post";

const EditPostScreen = ({ navigation, route }) => {
  const { post, routeName } = route?.params;

  const [disable, setDisable] = React.useState(false);
  const [selectedGame, setSelectedGame] = React.useState(post.game);
  const [title, setTitle] = React.useState(post.title);
  const [tags, setTags] = React.useState(post.tags || []);

  const updatePost = async () => {
    if (!checkTitle(title)) return;
    if (!checkGame(selectedGame)) return;

    setDisable(true);
    const onSuccess = () => {
      navigation.navigate({
        name: routeName,
        params: {
          type: "update",
          updatedPost: { id: post.id, game: selectedGame, title, tags },
        },
      });
    };
    const APIKit = await createAPIKit();
    APIKit.post("feed/post/update/", {
      post_id: post.id,
      title,
      game_id: selectedGame.id,
      tags: tags.map((user) => user.username),
    })
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
        setDisable(false);
      });
  };

  return (
    <PostDetails
      title={title}
      setTitle={setTitle}
      game={selectedGame}
      setGame={setSelectedGame}
      tags={tags}
      setTags={setTags}
      disable={disable}
      finish={updatePost}
      iconName="heart-half"
      buttonText="Update Post"
    />
  );
};

export default EditPostScreen;
