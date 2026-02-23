import LargeButton from "@/components/large-button";
import RadioButton from "@/components/radio-button";
import { useLoginSession } from "@/utils/context/login-context";
import { useSession } from "@/utils/context/user-context";
import { Link, router } from "expo-router";
import { Text, View } from "react-native";

const Index = () => {
  const { setUser } = useSession();
  const { userType, setUserType } = useLoginSession();

  const placeholderLogin = () => {
    setUser({
      id: "123",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "123-456-7890",
      requiresAssistance: true,
      eid: "jd4321",
      userType: "ut-affiliated",
    });
  };

  return (
    <View className="flex-1 bg-white px-5">
      <Text className="text-3xl font-medium mb-2">Who are you?</Text>
      <Link
        className="text-lg mb-12"
        onPress={placeholderLogin}
        replace
        href="/"
      >
        This helps us know who we’re picking up.
      </Link>
      <View className="flex-1 gap-4 flex-col justify-start">
        <RadioButton
          label="UT Student, Faculty, or Staff"
          selected={userType === "ut-affiliated"}
          onPress={() => setUserType("ut-affiliated")}
        ></RadioButton>
        <RadioButton
          label="Guest"
          selected={userType === "guest"}
          onPress={() => setUserType("guest")}
        ></RadioButton>
      </View>
      <LargeButton
        title="Continue"
        onPress={() => {
          router.navigate("/login/name");
        }}
        disabled={userType === null}
      ></LargeButton>
    </View>
  );
};

export default Index;
