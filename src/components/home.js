import React, { useContext } from "react";
import { View, Dimensions } from "react-native";
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
import InboxScreen from "../screens/inboxScreen";
import NotificationsScreen from "../screens/notificationsScreen";

import Chat from "../screens/chatScreen";
import Settings from "../screens/settingsScreen";
import Profile from "../screens/profileScreen";
import Search from "../screens/searchScreen";
import Followers from "../screens/followersScreen";
import Followings from "../screens/followingScreen";

import { createAPIKit } from "../utils/APIKit";
import { handleAPIError } from "../utils";
import { darkTheme } from "../utils/theme";

import { getDeepLink, ShareIcon, shareProfile } from "../utils/share";
import AuthContext from "../authContext";
import UploadScreen from "../screens/uploadScreen";
import PostScreen from "../screens/postScreen";
import ChangeGamesScreen from "../screens/gamesScreen";
import { flashAlert } from "../utils/flash_message";
import TermsScreen from "../screens/termsScreen";
import PolicyScreen from "../screens/policyScreen";

const NavigationContext = React.createContext();

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

  const [unreadChats, setUnreadChats] = React.useState(false);
  const [newNotifs, setNewNotifs] = React.useState(false);

  React.useEffect(() => {
    const fetchNotiChats = async () => {
      const onSuccess = (response) => {
        setUnreadChats(response.data?.payload?.unread);
      };

      const APIKit = await createAPIKit();
      APIKit.get("/chat/unread/", { cancelToken: cancelTokenSource.token })
        .then(onSuccess)
        .catch((e) => {
          flashAlert(handleAPIError(e));
        });
    };

    fetchNotiChats();

    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: darkTheme.background,
          elevation: 0,
          shadowOpacity: 0,
        },
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
            let iconName = focused ? "home" : "home-outline";
            return (
              <Ionicons name={iconName} size={TAB_ICON_SIZE} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            let iconName = focused
              ? "chatbubble-ellipses"
              : "chatbubble-ellipses-outline";
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
          return routeName && routeName !== "Feed"
            ? {
                headerTitle: routeName,
              }
            : { headerShown: false };
        }}
      />
      <Stack.Screen name="Chat" component={Chat} />
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
      <Stack.Screen name="Followers" component={Followers} />
      <Stack.Screen name="Following" component={Followings} />
      <Stack.Screen
        name="Upload"
        component={UploadScreen}
        options={{ title: "Upload Clip" }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
        }}
      />
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
              Notifications: "notifications",
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
            const { data } = response.notification.request.content;
            url = getDeepLink(data.type, data);

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

export default NavigatorWithContext;
