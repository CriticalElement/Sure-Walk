import { TouchableOpacity, Text, View } from "react-native";

const RadioButton = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View
        className={`flex-row items-center gap-4 t-colors border rounded-lg ${selected ? "bg-[#F3EAE1] border-ut-burntorange" : "bg-gray-50 border-gray-200"} px-6 py-4 rounded-full`}
      >
        <View
          className={`flex w-5 h-5 rounded-full border ${selected ? "border-ut-burntorange" : "border-gray-500"} items-center justify-center`}
        >
          <View
            className={`w-3.5 h-3.5 rounded-full ${selected ? "bg-ut-burntorange" : "bg-gray-50"}`}
          />
        </View>
        <Text className="text-gray-900 text-lg font-medium">{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
