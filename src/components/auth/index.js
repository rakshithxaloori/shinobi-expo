import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Welcome from "./welcome";
import SignIn from "./signIn";
import SignUp from "./signUp";
import TermsScreen from "../../screens/termsScreen";
import PolicyScreen from "../../screens/policyScreen";

const Stack = createStackNavigator();

const Auth = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy Policy" component={PolicyScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Auth;
