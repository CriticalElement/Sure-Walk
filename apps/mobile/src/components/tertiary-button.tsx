import { TouchableOpacity, View } from "react-native";

import FontText from "./font-text";

const TertiaryButton = ({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row gap-1 p-3 items-center justify-center bg-slate-50 rounded-[32px] border border-slate-200">
        {icon}
        <FontText className="font-medium">{title}</FontText>
      </View>
    </TouchableOpacity>
  );
};

export default TertiaryButton;
