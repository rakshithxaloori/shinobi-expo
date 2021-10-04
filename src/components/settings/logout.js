import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";

import AuthContext from "../../authContext";
import { lightTheme } from "../../utils/theme";

const LogOut = ({ icon, title, text }) => {
  const context = React.useContext(AuthContext);
  const { signOut } = React.useContext(AuthContext);

  return (
    <TouchableOpacity style={styles.container} onPress={signOut}>
      <IonIcons name="exit-outline" style={styles.icon} size={32} />
      <View style={styles.content}>
        <Text style={styles.title}>Log out</Text>
        <Text style={styles.text}>Hasta la vista, baby!</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    color: lightTheme.titleText,
    fontSize: 24,
    fontWeight: "600",
  },
  text: {
    color: lightTheme.titleText,
    fontWeight: "600",
    opacity: 0.6,
    marginTop: 5,
  },
  content: {
    paddingLeft: 20,
  },

  icon: {
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flexDirection: "row",
    marginTop: 15,
    marginRight: 0,
  },
});

export default LogOut;
