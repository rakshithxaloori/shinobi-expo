import React, { useContext } from "react";
import { View, StyleSheet, Dimensions, Share } from "react-native";
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

import * as RootNavigation from "./rootNavigation";

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

import LolMatch from "../screens/league_of_legends/lolMatchScreen";
import LolConnect from "../screens/league_of_legends/connectScreen";
import { ShareIcon, shareLolMatch, shareProfile } from "../utils/share";
import AuthContext from "../authContext";
import UploadScreen from "../screens/uploadScreen";
import ClipScreen from "../screens/clipScreen";
import ChangeGamesScreen from "../screens/gamesScreen";

const NavigationContext = React.createContext();

const fullScreenWidth = Dimensions.get("window").width;

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
  const [error, setError] = React.useState("");
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
          setError(handleAPIError(e));
        });
    };

    fetchNotiChats();

    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  return (
    <NavigationContext.Consumer>
      {(navigateRoute) => {
        const iconSize = 22;
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
            initialRouteName={navigateRoute}
          >
            <Tab.Screen
              name="Feed"
              component={FeedScreen}
              options={{
                headerShown: false,
                tabBarIcon: ({ focused, color }) => {
                  let iconName = focused ? "home" : "home-outline";
                  return (
                    <Ionicons name={iconName} size={iconSize} color={color} />
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
                    <Ionicons name={iconName} size={iconSize} color={color} />
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
                  let iconName = focused
                    ? "notifications"
                    : "notifications-outline";
                  return (
                    <Ionicons name={iconName} size={iconSize} color={color} />
                  );
                },
              }}
            />
          </Tab.Navigator>
        );
      }}
    </NavigationContext.Consumer>
  );
};

const StackNavigatorComponent = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContext.Consumer>
      {(navigateRoute) => {
        return (
          <NavigationContainer
            ref={RootNavigation.navigationRef}
            theme={MyTheme}
          >
            <Stack.Navigator
              initialRouteName={navigateRoute}
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
                  const routeName =
                    getFocusedRouteNameFromRoute(route) || "Feed";
                  return routeName && routeName !== "Feed"
                    ? {
                        headerTitle: routeName,
                      }
                    : { headerShown: false };
                }}
              />
              <Stack.Screen name="Chat" component={Chat} />
              <Stack.Screen name="Clip" component={ClipScreen} />
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={({ route }) => ({
                  title: "Profile",
                  headerRight: () => (
                    <ShareIcon
                      onPress={async () => {
                        await shareProfile(
                          route.params?.username || user?.username
                        );
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
              <Stack.Screen name="Search" component={Search} />
              <Stack.Screen
                name="LolMatch"
                component={LolMatch}
                options={({ route }) => ({
                  title: "Match",
                  headerRight: () => (
                    <ShareIcon
                      onPress={async () => {
                        await shareLolMatch(route.params?.match_id);
                      }}
                    />
                  ),
                })}
              />
              <Stack.Screen
                name="LolConnect"
                component={LolConnect}
                options={{ title: "Connect" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        );
      }}
    </NavigationContext.Consumer>
  );
};

const NavigatorWithContext = () => {
  const [navigateRoute, setNavigateRoute] = React.useState("");

  React.useEffect(() => {
    // const nrl =
    //   Notifications.addNotificationReceivedListener(_handleNotification);
    const nrrl = Notifications.addNotificationResponseReceivedListener(
      _handleNotificationResponse
    );

    // Handle deep links
    Linking.addEventListener("url", _foregroundURLListener);
    Linking.getInitialURL().then((url) => {
      if (url === null) return;
      _urlListener(url);
    });

    return () => {
      // Notifications.removeNotificationSubscription(nrl);
      Notifications.removeNotificationSubscription(nrrl);

      Linking.removeEventListener("url", _foregroundURLListener);
    };
  }, []);

  // const _handleNotification = (notification) => {
  //   console.log("_handleNotification", notification);
  // };

  const _foregroundURLListener = (event) => {
    _urlListener(event.url);
  };

  const _urlListener = (url) => {
    const { path, queryParams } = Linking.parse(url);
    switch (path) {
      case "s":
        if (queryParams.hasOwnProperty("username")) {
          RootNavigation.push("Profile", {
            username: queryParams.username,
          });
        }
        break;
      case "c":
        if (queryParams.hasOwnProperty("clip")) {
          RootNavigation.push("Clip", { clip_id: queryParams.clip });
        }
      case "lol":
        if (queryParams.hasOwnProperty("match_id")) {
          RootNavigation.push("LolMatch", {
            match_id: queryParams.match_id,
          });
        }
        break;
    }
  };

  const _handleNotificationResponse = (response) => {
    switch (response.notification?.request?.content?.data?.type) {
      case "s":
        // Example of using RootNavigation
        RootNavigation.push("Settings");
        setNavigateRoute("Settings");
        break;
      case "f":
        RootNavigation.push("Home", { screen: "Notifications" });
        // navigateRoute is used when navigationRef is not yet ready
        // and the RootNavigation.navigate is ignored
        setNavigateRoute("Notifications");
        break;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: darkTheme.background }}>
      <NavigationContext.Provider value={navigateRoute}>
        <StackNavigatorComponent />
      </NavigationContext.Provider>
      <StatusBar
        style={darkTheme.status_bar}
        backgroundColor={darkTheme.background}
      />
      <FlashMessage position="down" />
    </View>
  );
};

export default NavigatorWithContext;
