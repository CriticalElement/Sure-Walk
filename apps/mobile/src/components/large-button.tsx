import { TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";

import FontText from "./font-text";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const LargeButton = ({
  title,
  onPress,
  disabled = false,
  blue = false,
  small = false,
  medium = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  blue?: boolean;
  small?: boolean;
  medium?: boolean;
}) => {
  let color = blue ? "bg-ut-bluebonnet" : "bg-ut-burntorange";

  return (
    <AnimatedTouchable
      className={`${small ? "h-[40px]" : medium ? "h-[48px]" : "h-[56px]"} px-5 rounded-full flex-col transition-colors ${color} disabled:bg-slate-200 justify-center`}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <FontText
        className={`${disabled ? "text-slate-500" : "text-white"} text-center ${small ? "text-lg" : "text-xl"} font-medium`}
      >
        {title}
      </FontText>
    </AnimatedTouchable>
  );
};

export default LargeButton;
