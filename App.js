import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Toast from "react-native-toast-notifications";

import StartScreen from "./Screens/StartScreen";
import WalletScreen from "./Screens/WalletScreen";
import ImportScreen from "./Screens/ImportScreen";
import CreateWalletScreen from "./Screens/CreateWalletScreen";
import SettingsScreen from "./Screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="WalletScreens" component={WalletScreens} />
          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="Import" component={ImportScreen} />
          <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast ref={(ref) => (global["Toast"] = ref)} />
    </>
  );
}

function WalletScreens() {
  return (
    <Drawer.Navigator
      initialRouteName="Wallet"
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Wallet" component={WalletScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
