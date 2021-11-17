import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Avatar, Button, Overlay } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import FastImage from "react-native-fast-image";
import * as ImagePicker from "expo-image-picker";

import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils";
import { avatarDefaultStyling } from "../../utils/styles";
import { darkTheme } from "../../utils/theme";
import { flashAlert } from "../../utils/flash_message";

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
  const [image, setImage] = React.useState(null);

  const maxBioLength = 150;

  React.useEffect(
    () => () => {
      cancelTokenSource.cancel();
    },
    []
  );

  const selectPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const saveProfile = async () => {
    setDisable(true);
    const onSuccess = (response) => {
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
        flashAlert(handleAPIError(e));
      })
      .finally(() => {
        setDisable(false);
        setVisible(false);
      });
  };

  return (
    <View>
      <Button
        title="Edit Bio"
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
        <TouchableOpacity
          style={styles.pictureTouchable}
          onPress={selectPicture}
        >
          <Avatar
            rounded
            title={username[0]}
            source={{ uri: picture }}
            overlayContainerStyle={[avatarDefaultStyling, { paddingRight: 10 }]}
            size={60}
            ImageComponent={FastImage}
          />
          <Ionicons
            name="camera"
            size={30}
            color={darkTheme.on_background}
            style={{
              paddingLeft: 10,
            }}
          />
        </TouchableOpacity>
        <TextInput
          style={[
            styles.bio,
            {
              color:
                newBio.length > maxBioLength ? "red" : darkTheme.on_background,
            },
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
            {
              color:
                newBio.length > maxBioLength ? "red" : darkTheme.on_background,
            },
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
  pictureTouchable: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  bio: {
    height: 150,
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: darkTheme.on_background,
  },
  count: {
    alignSelf: "flex-end",
  },
  overlay: {
    borderRadius: 10,
    padding: 20,
    width: screen.width - 60,
    maxHeight: screen.height - 100,
    alignItems: "center",
    backgroundColor: darkTheme.background,
    borderWidth: 1,
    borderColor: darkTheme.on_background,
  },
});

export default EditProfileButton;
