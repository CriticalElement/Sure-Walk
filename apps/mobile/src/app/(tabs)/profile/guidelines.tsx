import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, View } from "react-native";

import BackButton from "@/src/components/back-button";
import FontText from "@/src/components/font-text";
import GuidelinesList from "@/src/components/guidelines-list";

const guidelines = () => {
  return (
    <View className="flex-1 flex-col bg-white">
      <View className="flex-col bg-white flex-1 pt-[34px] mt-safe">
        <View className="px-5">
          <BackButton />
        </View>
        <View className="pb-2 pt-8">
          <FontText className="text-2xl font-medium px-5 z-100">
            Information and Guidelines
          </FontText>
        </View>
        <View className="relative flex-1 p-0 z-5">
          <LinearGradient
            colors={["#ffffffff", "#ffffff00"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 20,
              zIndex: 10,
            }}
          />
          <LinearGradient
            colors={["#ffffff00", "#ffffffff"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 20,
              zIndex: 10,
            }}
          />
          <ScrollView className="flex-col flex-1">
            <GuidelinesList />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default guidelines;
