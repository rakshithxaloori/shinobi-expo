import React from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

import { darkTheme } from "../../../utils/theme";
import EditProfileOverlay from "./overlay";

const EditProfileButton = (props) => {
  const [visible, setVisible] = React.useState(false);

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
        buttonStyle={props.buttonStyle}
        titleStyle={props.buttonTextStyle}
      />
      <EditProfileOverlay
        {...props}
        visible={visible}
        setVisible={setVisible}
      />
    </View>
  );
};

export default EditProfileButton;
