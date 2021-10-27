import React from "react";
import { View, Dimensions } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import FlashMessage from "react-native-flash-message";

import * as RootNavigation from "./rootNavigation";

import FeedScreen from "./feed";
import InboxScreen from "./chat";
import NotificationsScreen from "./notifications";

import Chat from "./chat/chat";
import Settings from "./settings";
import Profile from "./profile";
import Search from "./search";

import { createAPIKit } from "../utils/APIKit";
import { handleAPIError } from "../utils";
import { darkTheme } from "../utils/theme";
import LolMatch from "./games/league_of_legends/match";
import LolConnect from "./games/league_of_legends/connect";
import MatchHeader from "./headers/match_header";

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
        return (
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: darkTheme.surface,
                elevation: 0,
                shadowOpacity: 0,
              },
              tabBarActiveTintColor: darkTheme.primary,
              tabBarInactiveTintColor: "grey",
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
                  return <Icon type="ionicon" name={iconName} color={color} />;
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
                  return <Icon type="ionicon" name={iconName} color={color} />;
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
                  return <Icon type="ionicon" name={iconName} color={color} />;
                },
              }}
            />
          </Tab.Navigator>
        );
      }}
    </NavigationContext.Consumer>
  );
};

const StackNavigatorComponent = () => (
  <NavigationContext.Consumer>
    {(navigateRoute) => {
      return (
        <NavigationContainer ref={RootNavigation.navigationRef} theme={MyTheme}>
          <Stack.Navigator
            initialRouteName={navigateRoute}
            screenOptions={{
              headerBackImage: () => (
                <Icon
                  style={{ marginLeft: 8 }}
                  type="ionicon"
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
            <Stack.Screen name="Profile" component={Profile} />
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
              options={{ title: "Match" }}
              // options={{ headerTitle: (props) => <MatchHeader {...props} /> }}
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

const NavigatorWithContext = () => {
  const [navigateRoute, setNavigateRoute] = React.useState("");

  React.useEffect(() => {
    // const nrl =
    //   Notifications.addNotificationReceivedListener(_handleNotification);
    const nrrl = Notifications.addNotificationResponseReceivedListener(
      _handleNotificationResponse
    );
    return () => {
      // Notifications.removeNotificationSubscription(nrl);
      Notifications.removeNotificationSubscription(nrrl);
    };
  }, []);

  // const _handleNotification = (notification) => {
  //   console.log("_handleNotification", notification);
  // };

  const _handleNotificationResponse = (response) => {
    switch (response.notification?.request?.content?.data?.type) {
      case "s":
        // Example of using RootNavigation
        RootNavigation.navigate("Settings");
        setNavigateRoute("Settings");
        break;
      case "f":
        RootNavigation.navigate("Home", { screen: "Notifications" });
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
