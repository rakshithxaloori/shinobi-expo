import React, { useContext } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import axios from "axios";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import FlashMessage from "react-native-flash-message";
import { Ionicons } from "@expo/vector-icons";

import FeedScreen from "../screens/feedScreen";
import NotificationsScreen from "../screens/notificationsScreen";

import Settings from "../screens/settingsScreen";
import Profile from "../screens/profileScreen";
import Search from "../screens/searchScreen";
import Followers from "../screens/followersScreen";
import Followings from "../screens/followingScreen";
import UploadScreen from "../screens/uploadScreen";
import PostScreen from "../screens/postScreen";
import ChangeGamesScreen from "../screens/gamesScreen";
import TermsScreen from "../screens/termsScreen";
import PolicyScreen from "../screens/policyScreen";
import SocialsScreen from "../screens/socialsScreen";
import EditPostScreen from "../screens/editPostScreen";
import PrivacySettingsScreen from "../screens/privacySettingsScreen";
import ExploreScreen from "../screens/exploreScreen";
import RequestGameScreen from "../screens/requestGameScreen";

import { darkTheme } from "../utils/theme";

import { getDeepLink, ShareIcon, shareProfile } from "../utils/share";
import AuthContext from "../authContext";

import { createAPIKit } from "../utils/APIKit";
import { flashAlert } from "../utils/flash_message";
import { handleAPIError } from "../utils";

const fullScreenWidth = Dimensions.get("window").width;
const TAB_ICON_SIZE = 22;

const Stack = createStackNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: darkTheme.background,
  },
};

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const TabNavigatorComponent = () => {
  let cancelTokenSource = axios.CancelToken.source();

  const updateCountry = async (country_code) => {
    const APIKit = await createAPIKit();
    APIKit.post("auth/update/country/", { country_code }).catch((e) => {
      flashAlert(handleAPIError(e));
    });
  };

  React.useEffect(() => {
    const getCountryCode = async () => {
      let publicIpAddress = await axios.get("https://api.ipify.org");
      publicIpAddress = publicIpAddress?.data;
      let geoResponse = await axios.get(
        `http://www.geoplugin.net/json.gp?ip=${publicIpAddress}`
      );

      if (geoResponse.status === 200) {
        await updateCountry(geoResponse.data.geoplugin_countryCode);
      }
    };

    getCountryCode();

    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: tabBarStyles.tabBarStyle,
        tabBarActiveTintColor: darkTheme.primary,
        tabBarInactiveTintColor: "grey",
        tabBarShowLabel: false,
        style: { width: fullScreenWidth },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            let iconName = focused ? "heart" : "heart-outline";
            return (
              <Ionicons name={iconName} size={TAB_ICON_SIZE} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="World Posts"
        component={ExploreScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            let iconName = focused ? "planet" : "planet-outline";
            return (
              <Ionicons name={iconName} size={TAB_ICON_SIZE} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            let iconName = focused ? "cloud-upload" : "cloud-upload-outline";
            return (
              <Ionicons name={iconName} size={TAB_ICON_SIZE} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            let iconName = focused ? "notifications" : "notifications-outline";
            return (
              <Ionicons name={iconName} size={TAB_ICON_SIZE} color={color} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigatorComponent = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackImage: () => (
          <Ionicons
            style={{ marginLeft: 8 }}
            name="arrow-back-outline"
            size={30}
            color={darkTheme.on_background}
          />
        ),
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
        headerTintColor: darkTheme.on_background,
        headerTitleStyle: { fontSize: 20 },
        headerStyle: {
          backgroundColor: darkTheme.background,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={TabNavigatorComponent}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) || "Feed";
          return routeName &&
            routeName !== "Feed" &&
            routeName !== "World Posts"
            ? {
                headerTitle: routeName,
              }
            : { headerShown: false };
        }}
      />
      <Stack.Screen name="Clip" component={PostScreen} />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={({ route }) => ({
          title: "Profile",
          headerRight: () => (
            <ShareIcon
              onPress={async () => {
                await shareProfile(route.params?.username || user?.username);
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Games"
        component={ChangeGamesScreen}
        options={{ title: "Games I Play" }}
      />
      <Stack.Screen
        name="Connect Socials"
        component={SocialsScreen}
        options={{ title: "My Socials" }}
      />
      <Stack.Screen name="Followers" component={Followers} />
      <Stack.Screen name="Following" component={Followings} />
      <Stack.Screen name="Edit Post" component={EditPostScreen} />
      <Stack.Screen
        name="Request Game"
        component={RequestGameScreen}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Privacy Settings" component={PrivacySettingsScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy Policy" component={PolicyScreen} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  );
};

const NavigatorWithContext = () => {
  return (
    <View style={{ flex: 1, backgroundColor: darkTheme.background }}>
      <NavigationContainer
        theme={MyTheme}
        linking={{
          prefixes: ["https://*.shinobi.cc"],
          config: {
            // Configuration for linking
            initialRouteName: "Home",
            screens: {
              Profile: "profile/:username",
              Clip: "clip/:post_id",
              Home: {
                initialRouteName: "Feed",
                screens: { Notifications: "notifications" },
              },
            },
          },
          async getInitialURL() {
            // First, you may want to do the default deep link handling
            // Check if app was opened from a deep link
            let url = await Linking.getInitialURL();

            if (url != null) {
              return url;
            }

            // Handle URL from expo push notifications
            const response =
              await Notifications.getLastNotificationResponseAsync();
            const data = response?.notification?.request?.content?.data;
            url = getDeepLink(data?.type, data);
            return url;
          },
          subscribe(listener) {
            const onReceiveURL = ({ url }) => listener(url);

            // Listen to incoming links from deep linking
            Linking.addEventListener("url", onReceiveURL);

            // Listen to expo push notifications
            const subscription =
              Notifications.addNotificationResponseReceivedListener(
                (response) => {
                  const { data } = response.notification.request.content;
                  const url = getDeepLink(data.type, data);

                  // Let React Navigation handle the URL
                  listener(url);
                }
              );

            return () => {
              // Clean up the event listeners
              Linking.removeEventListener("url", onReceiveURL);
              subscription.remove();
            };
          },
        }}
      >
        <StackNavigatorComponent />
      </NavigationContainer>

      <StatusBar
        style={darkTheme.status_bar}
        backgroundColor={darkTheme.background}
      />
      <FlashMessage position="down" />
    </View>
  );
};

export const tabBarStyles = StyleSheet.create({
  tabBarStyle: {
    borderTopWidth: 0,
    backgroundColor: darkTheme.background,
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default NavigatorWithContext;
