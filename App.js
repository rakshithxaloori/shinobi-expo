// https://logomakr.com/2i81xD
import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: process.env.CI_CD_STAGE !== "production", // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});

import React from "react";
import { AppState, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import axios from "axios";

import AuthContext from "./src/authContext";

import SplashScreen from "./src/screens/splashScreen";
import AuthScreen from "./src/components/auth";
import HomeScreen from "./src/components/home";

import { createAPIKit } from "./src/utils/APIKit";
import { handleAPIError } from "./src/utils";
import { flashAlert } from "./src/utils/flash_message";

if (process.env.CI_CD_STAGE === "production") {
  console.log = () => {};
}

const App = () => {
  let cancelTokenSource = axios.CancelToken.source();
  const [error, setError] = React.useState("");
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            user: action.user,
            userToken: action.token,
            isLoading: false,
          };
        case "INVALID_TOKEN":
          return {
            ...prevState,
            user: null,
            userToken: null,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            user: action.user,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            user: null,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      user: null,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync("token_key");

        // After restoring token, we may need to validate it
        if (userToken) {
          const onSuccess = (response) => {
            const user = response.data?.payload;
            dispatch({ type: "RESTORE_TOKEN", user: user, token: userToken });
          };

          const handleResponse = async ({ status, data }) => {
            if (status < 500) {
              try {
                flashAlert(data.detail);
                await SecureStore.deleteItemAsync("token_key");
              } catch (e) {}

              dispatch({ type: "INVALID_TOKEN" });
            } else {
              flashAlert(
                "Trouble connecting to the internet",
                undefined,
                undefined,
                5000
              );
            }
          };

          const onFailure = async (error) => {
            if (error.response) {
              await handleResponse(error.response);
            } else {
              flashAlert(handleAPIError(error));
            }
          };

          const APIKit = await createAPIKit();
          APIKit.get("auth/online/", { cancelToken: cancelTokenSource.token })
            .then(onSuccess)
            .catch(onFailure);
        } else {
          dispatch({ type: "INVALID_TOKEN" });
        }
      } catch (e) {
        // Restoring token failed
        dispatch({ type: "INVALID_TOKEN" });
      }
    };

    bootstrapAsync();

    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      cancelTokenSource.cancel();
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    if (state.userToken !== null) {
      if (nextAppState === "inactive" || nextAppState === "background") {
        const APIKit = await createAPIKit();
        APIKit.get("/auth/offline/", {
          cancelToken: cancelTokenSource.token,
        }).catch((e) => {
          console.log(e);
        });
      } else {
        if (nextAppState === "active") {
          const APIKit = await createAPIKit();
          APIKit.get("/auth/online/", {
            cancelToken: cancelTokenSource.token,
          }).catch((e) => {
            setError(handleAPIError(e));
          });
        }
      }
    }
  };

  const authContext = React.useMemo(
    () => ({
      saveUser: async ({ token_key, username, picture }) => {
        if (token_key) {
          await SecureStore.setItemAsync("token_key", token_key);

          // register for notifications and send token to API
          if (Device.isDevice) {
            const expoPushToken = await registerForPushNotificationsAsync();
            const APIKit = await createAPIKit();
            APIKit.post(
              "/notification/token/create/",
              {
                token: expoPushToken,
              },
              { cancelToken: cancelTokenSource.token }
            ).catch((e) => {
              setError(handleAPIError(e));
            });
          }

          dispatch({
            type: "SIGN_IN",
            userToken: token_key,
            user: { username, picture },
          });
        } else {
          dispatch({
            type: "SIGN_IN",
            user: { username, picture },
          });
        }
      },

      signOut: async () => {
        // revoke/delete expoPushToken in API
        let expoPushToken = null;
        if (Device.isDevice) {
          expoPushToken = await registerForPushNotificationsAsync();
        }
        const APIKit = await createAPIKit();
        APIKit.post(
          "/auth/logout/",
          { token: expoPushToken },
          { cancelToken: cancelTokenSource.token }
        ).catch((e) => {
          setError(handleAPIError(e));
        });
        try {
          await SecureStore.deleteItemAsync("token_key");
        } catch (e) {}
        dispatch({ type: "SIGN_OUT" });
      },
    }),
    []
  );

  if (state.isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen error={error} />;
  }

  return (
    <AuthContext.Provider value={{ ...authContext, user: state.user }}>
      {state.userToken === null ? <AuthScreen /> : <HomeScreen />}
    </AuthContext.Provider>
  );
};

export default App;

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
