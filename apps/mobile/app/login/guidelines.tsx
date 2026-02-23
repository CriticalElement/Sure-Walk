import CheckButton from "@/components/check-button";
import GuidelinesList from "@/components/guidelines-list";
import LargeButton from "@/components/large-button";
import { useLoginSession } from "@/utils/context/login-context";
import { useSession } from "@/utils/context/user-context";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View, Text } from "react-native";

const Guidelines = () => {
  const { firstName, lastName, phoneNumber, requiresAssistance, userType } =
    useLoginSession();
  const { setUser } = useSession();
  const [checked, setChecked] = useState(false);

  const updateUserAndContinue = () => {
    let eid = undefined;
    if (userType === "ut-affiliated") {
      eid = "asdf1234"; // TODO: Get real EID
    }
    setUser({
      id: "123",
      firstName,
      lastName,
      phoneNumber,
      requiresAssistance: requiresAssistance!,
      eid,
      userType: userType!,
    });
    router.replace("/home");
  };

  return (
    <View className="flex-1 bg-white">
      <Text className="text-3xl font-medium mb-2 px-5">
        Information and Guidelines
      </Text>
      <Text className="text-lg px-5">Read and accept to continue.</Text>
      <ScrollView className="flex-1 flex-col">
        <GuidelinesList includeBottomBorder />
        <View className="pt-6 px-5 pb-[46px]">
          <CheckButton
            label="I have read and accept the guidelines."
            isChecked={checked}
            onPress={() => setChecked(!checked)}
          />
        </View>
      </ScrollView>
      <View className="px-5">
        <LargeButton
          title="Continue"
          onPress={updateUserAndContinue}
          disabled={!checked}
        />
      </View>
    </View>
  );
};

export default Guidelines;
