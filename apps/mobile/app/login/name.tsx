import LargeButton from "@/components/large-button";
import TextInputField from "@/components/text-input-field";
import { useLoginSession } from "@/utils/context/login-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import FontText from "@/components/font-text";

const Name = () => {
  const { firstName, lastName, setFirstName, setLastName } = useLoginSession();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const valid = firstName.trim().length > 0 && lastName.trim().length > 0;
    setIsValid(valid);
  }, [firstName, lastName]);

  return (
    <View className="flex-1 bg-white px-5">
      <FontText className="text-3xl font-medium mb-2">
        What’s your name?
      </FontText>
      <FontText className="text-lg mb-12">
        This helps us know who we’re picking up.
      </FontText>
      <View className="flex-1 gap-4 flex-col justify-start">
        <TextInputField
          fieldName="First Name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
          autoComplete="given-name"
          maxLength={40}
          placeholder="Longhorn"
        />
        <TextInputField
          fieldName="Last Name"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
          autoComplete="family-name"
          maxLength={40}
          placeholder="Bevo"
        />
      </View>
      <LargeButton
        title="Continue"
        onPress={() => {
          router.navigate("/login/phone");
        }}
        disabled={!isValid}
      ></LargeButton>
    </View>
  );
};

export default Name;
