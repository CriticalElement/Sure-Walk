import { CheckSquareIcon, SquareIcon } from "phosphor-react-native";
import { TouchableOpacity, View } from "react-native";
import FontText from "./font-text";
import { UTBurntOrange } from "../utils/colors";

const CheckButton = ({
  label: text,
  onPress = () => {},
  isChecked,
  color = UTBurntOrange,
}: {
  label: string;
  onPress?: () => void;
  isChecked: boolean;
  color?: string;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row items-center justify-start gap-2.5 t-colors">
        {isChecked ? (
          <CheckSquareIcon size={20} color={color} weight="fill" />
        ) : (
          <SquareIcon size={20} color="#44403c" />
        )}
        <FontText className="text-stone-700 text-lg">{text}</FontText>
      </View>
    </TouchableOpacity>
  );
};

export default CheckButton;
