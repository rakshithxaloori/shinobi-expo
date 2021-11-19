import React, { useContext } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Avatar, Button, Overlay } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import FastImage from "react-native-fast-image";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

import { uploadFile } from "../../../utils/APIKit";
import { handleAPIError } from "../../../utils";
import { avatarDefaultStyling } from "../../../utils/styles";
import { flashAlert } from "../../../utils/flash_message";
import { darkTheme } from "../../../utils/theme";
import AuthContext from "../../../authContext";

const screen = Dimensions.get("screen");

const EditProfileOverlay = ({
  username,
  picture,
  bio,
  updateBioProfile,
  updatePictureProfile,
  buttonStyle,
  buttonTextStyle,
  visible,
  setVisible,
}) => {
  const { user } = useContext(AuthContext);
  let cancelTokenSource = axios.CancelToken.source();

  const [disable, setDisable] = React.useState(true);
  const [newBio, setNewBio] = React.useState(bio);
  const [newPicture, setNewPicture] = React.useState(picture);

  const maxBioLength = 150;

  React.useEffect(() => {
    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  const selectPicture = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status == "granted") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
          base64: true,
        });

        if (!result.cancelled) {
          const maniImage = await ImageManipulator.manipulateAsync(
            result.uri,
            [{ resize: { width: 500 } }],
            { format: ImageManipulator.SaveFormat.PNG }
          );
          setNewPicture(maniImage.uri);
        }
      } else {
        flashAlert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  const saveProfile = async () => {
    if (bio === newBio && newPicture === picture) return;
    setDisable(true);
    const onSuccess = (response) => {
      updateBioProfile(newBio);
      updatePictureProfile(newPicture);
      setVisible(false);
    };

    uploadFile("/profile/update/", newPicture, "picture", { bio: newBio })
      .then(onSuccess)
      .catch((e) => {
        flashAlert(handleAPIError(e));
        setDisable(false);
      });
  };

  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={() => setVisible(false)}
      overlayStyle={styles.overlay}
    >
      <TouchableOpacity style={styles.pictureTouchable} onPress={selectPicture}>
        <Avatar
          rounded
          title={username[0]}
          source={{ uri: newPicture }}
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
        disabled={bio === newBio && picture === newPicture && disable}
        onPress={saveProfile}
        buttonStyle={buttonStyle}
        titleStyle={buttonTextStyle}
      />
    </Overlay>
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
  overlayButton: { backgroundColor: darkTheme.primary },
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

export default EditProfileOverlay;
