import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";

import { handleAPIError } from "../../utils";
import { createAPIKit } from "../../utils/APIKit";

import UnfollowOverlay from "./unfollowOverlay";

const FollowButton = ({ username, following, setFollowing, buttonStyle }) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  const follow = async () => {
    setDisabled(true);
    const onSuccess = (response) => {
      setFollowing(true);
    };
    const APIKit = await createAPIKit();
    APIKit.get(`/profile/follow/${username}/`, {
      cancelToken: cancelTokenSource.token,
    })
      .then(onSuccess)
      .catch((e) => {
        console.log(handleAPIError(e));
      })
      .finally(() => setDisabled(false));
  };

  return following ? (
    <View>
      <UnfollowOverlay
        username={username}
        showOverlay={showOverlay}
        setFollowing={setFollowing}
        setShowOverlay={setShowOverlay}
      />
      <Button
        title="Following"
        onPress={() => setShowOverlay(true)}
        icon={
          <Ionicons name="heart" size={15} color="white" style={styles.icon} />
        }
        buttonStyle={buttonStyle}
      />
    </View>
  ) : (
    <Button
      title="Follow"
      disabled={disabled}
      onPress={follow}
      icon={
        <Ionicons
          name="heart-outline"
          size={15}
          color="white"
          style={styles.icon}
        />
      }
      buttonStyle={buttonStyle}
    />
  );
};

const styles = StyleSheet.create({
  icon: { paddingRight: 3 },
});

export default FollowButton;
