import LargeButton from "@/components/large-button";
import TextInputField from "@/components/text-input-field";
import { useLoginSession } from "@/utils/context/login-context";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import FontText from "@/components/font-text";

const Phone = () => {
  const checkValidity = (value: string) => {
    return value.replace(/\D/g, "").length >= 10;
  };

  const { phoneNumber, setPhoneNumber } = useLoginSession();
  const [isValid, setIsValid] = useState(checkValidity(phoneNumber));

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    setIsValid(checkValidity(value));
  };

  return (
    <View className="flex-1 bg-white px-5">
      <FontText className="text-3xl font-medium mb-2">
        Enter your phone number
      </FontText>
      <FontText className="text-lg mb-12">
        We'll call as we approach your location.
      </FontText>
      <View className="flex-1 gap-4 flex-col justify-start">
        <TextInputField
          fieldName="Phone Number"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="phone-pad"
          autoComplete="tel"
          maxLength={14}
          placeholder="(123) 456-7890"
        />
      </View>
      <LargeButton
        title="Continue"
        disabled={!isValid}
        onPress={() => {
          router.navigate("/login/confirm");
        }}
      />
    </View>
  );
};

export default Phone;
