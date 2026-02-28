import { Platform, StyleProp, TextInput, TextStyle, View } from "react-native";
import FontText from "./font-text";

const TextInputField = ({
  fieldName,
  ...props
}: { fieldName: string } & React.ComponentProps<typeof TextInput>) => {
  let _style: StyleProp<TextStyle> = {};
  if (Platform.OS === "ios") {
    _style.lineHeight = 0;
  }

  return (
    <View className="flex-col gap-2">
      <FontText className="text-lg font-semibold text-gray-900">
        {fieldName}
      </FontText>
      <TextInput
        className="bg-gray-50 border border-gray-200 text-gray-900 text-lg rounded-lg t-colors focus:ring-ut-blue focus:border-ut-blue block w-full p-4"
        {...props}
        placeholderTextColor={"#6b7280"}
        style={_style}
      />
    </View>
  );
};

export default TextInputField;
