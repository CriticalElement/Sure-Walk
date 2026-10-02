import { router } from "expo-router";
import { Image, View } from "react-native";

import FontText from "@/src/components/font-text";
import LargeButton from "@/src/components/large-button";
import OutlineButton from "@/src/components/outline-button";

const Index = () => {
  return (
    <View className="bg-white pt-safe pb-safe px-5 flex-col flex-1 justify-between">
      <View className="px-[48px] py-[34px]">
        <Image
          source={require("../../../assets/images/splash-orange.png")}
          className="w-full"
          style={{ objectFit: "contain" }}
        />
      </View>
      <View className="flex-col gap-6">
        <LargeButton
          title="Sign Up"
          onPress={() => router.navigate("/login/sign-up")}
        />
        <OutlineButton
          title="Log In"
          onPress={() => router.navigate("/login/login-generic")}
        />
        <FontText className="text-md font-normal color-slate-400 text-center">
          Officially partnered with PTS,{"\n"}made by Longhorn Developers
        </FontText>
      </View>
    </View>
  );
};

export default Index;
