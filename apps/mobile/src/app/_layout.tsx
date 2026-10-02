import "../app/globals.css";

import * as NavigationBar from "expo-navigation-bar";
import * as Notifications from "expo-notifications";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { configureReanimatedLogger } from "react-native-reanimated";

import { SessionProvider } from "@/src/utils/context/user-context";

import { PushNotificationsProvider } from "../utils/context/push-notifications-context";
import { ToastProvider } from "../utils/context/toast-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true,
  }),
});

configureReanimatedLogger({ strict: false });

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const configureNavbarAndroid = async () => {
    if (Platform.OS === "android") {
      await NavigationBar.setPositionAsync("absolute");
      await NavigationBar.setBackgroundColorAsync("#ffffff00");
      await NavigationBar.setButtonStyleAsync("dark");
    }
  };

  useEffect(() => {
    configureNavbarAndroid();
  }, []);

  return (
    <View className="bg-white h-full w-full">
      <StatusBar
        style="auto"
        backgroundColor="transparent"
        translucent={true}
      />
      <KeyboardProvider>
        <GestureHandlerRootView>
          <ToastProvider>
            <SessionProvider>
              <PushNotificationsProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="login"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="cancellation-reason"
                    options={{ presentation: "containedModal" }}
                  />
                  <Stack.Screen
                    name="feedback"
                    options={{ presentation: "containedModal" }}
                  />
                </Stack>
              </PushNotificationsProvider>
            </SessionProvider>
          </ToastProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </View>
  );
}
