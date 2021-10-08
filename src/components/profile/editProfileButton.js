import React from "react";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import { Avatar, Button, Overlay } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";

import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils";
import { avatarDefaultStyling } from "../../utils/styles";
import { darkTheme } from "../../utils/theme";

const screen = Dimensions.get("screen");

const EditProfileButton = ({
  username,
  picture,
  bio,
  setBio,
  buttonStyle,
  buttonTextStyle,
}) => {
  let cancelTokenSource = axios.CancelToken.source();
  const [visible, setVisible] = React.useState(false);
  const [disable, setDisable] = React.useState(false);
  const [newBio, setNewBio] = React.useState(bio);
  const maxBioLength = 150;

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  const saveProfile = async () => {
    setDisable(true);
    const onSuccess = (response) => {
      console.log(response.data.detail);
      setBio(newBio);
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      "/profile/update/",
      { bio: newBio },
      { cancelToken: cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        console.log(handleAPIError(e));
      })
      .finally(() => {
        setDisable(false);
        setVisible(false);
      });
  };

  return (
    <View>
      <Button
        title="Edit Profile"
        icon={
          <Ionicons
            name="create"
            size={15}
            color={darkTheme.on_primary}
            style={{ paddingRight: 3 }}
          />
        }
        onPress={() => setVisible(true)}
        buttonStyle={buttonStyle}
        titleStyle={buttonTextStyle}
      />
      <Overlay
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
        overlayStyle={styles.overlay}
      >
        <Avatar
          rounded
          title={username[0]}
          source={{ uri: picture }}
          overlayContainerStyle={avatarDefaultStyling}
          size={60}
        />
        <TextInput
          style={[
            styles.bio,
            { color: newBio.length > maxBioLength ? "red" : "black" },
          ]}
          multiline
          textAlignVertical="top"
          placeholder="What's up humanity!"
          value={newBio}
          onChangeText={(value) => {
            const newValue = value.replace(/\s+/g, " ");
            setNewBio(newValue);
          }}
        />
        <Text
          style={[
            styles.count,
            { color: newBio.length > maxBioLength ? "red" : "black" },
          ]}
        >
          {newBio.length}/{maxBioLength}
        </Text>
        <Button
          title="Save Profile"
          disabled={disable || newBio == bio}
          onPress={saveProfile}
          buttonStyle={styles.button}
          titleStyle={buttonTextStyle}
        />
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  bio: {
    height: 150,
    width: "100%",
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  count: {
    alignSelf: "flex-end",
  },
  overlay: {
    borderRadius: 5,
    padding: 20,
    width: screen.width - 60,
    maxHeight: screen.height - 100,
    alignItems: "center",
  },
});

export default EditProfileButton;
