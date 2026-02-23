import { CheckSquareIcon, SquareIcon } from "phosphor-react-native";
import { TouchableOpacity, View, Text } from "react-native";

const CheckButton = ({
  label: text,
  onPress = () => {},
  isChecked,
}: {
  label: string;
  onPress?: () => void;
  isChecked: boolean;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row items-center justify-start gap-2.5 t-colors">
        {isChecked ? (
          <CheckSquareIcon size={20} color="#BF5700" weight="fill" />
        ) : (
          <SquareIcon size={20} color="#44403c" />
        )}
        <Text className="text-stone-700 text-lg">{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CheckButton;
