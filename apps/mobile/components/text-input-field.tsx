import { Text, TextInput, View } from "react-native";

const TextInputField = ({
  fieldName,
  ...props
}: { fieldName: string } & React.ComponentProps<typeof TextInput>) => {
  return (
    <View className="flex-col gap-2">
      <Text className="text-lg font-semibold text-gray-900">{fieldName}</Text>
      <TextInput
        className="bg-gray-50 border border-gray-200 text-gray-900 text-lg rounded-lg t-colors focus:ring-ut-blue focus:border-ut-blue block w-full p-4"
        {...props}
        placeholderTextColor={"#6b7280"}
      />
    </View>
  );
};

export default TextInputField;
