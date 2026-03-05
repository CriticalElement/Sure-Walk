import * as SplashScreen from "expo-splash-screen";
import { Redirect } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  return <Redirect href="/home" />;
}
