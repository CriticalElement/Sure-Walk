import { TouchableOpacity } from "react-native";
import FontText from "./font-text";

const LargeButton = ({
  title,
  onPress,
  disabled = false,
  orange = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  orange?: boolean;
}) => {
  let color = disabled
    ? "bg-gray-300"
    : orange
      ? "bg-ut-burntorange"
      : "bg-ut-bluebonnet";

  return (
    <TouchableOpacity
      className={`px-4 py-3.5 rounded-full flex-col t-colors ${color}`}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <FontText className="text-white text-center text-xl">{title}</FontText>
    </TouchableOpacity>
  );
};

export default LargeButton;
