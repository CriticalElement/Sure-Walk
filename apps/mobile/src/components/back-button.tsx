import { router } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";

import { slate900 } from "../utils/colors";

const BackButton = ({ action }: { action?: () => void }) => {
  return (
    <TouchableOpacity
      className="w-12 h-12 rounded-2xl border border-slate-200 items-center justify-center"
      onPress={() => {
        if (!action) {
          router.back();
        } else {
          action();
        }
      }}
    >
      <CaretLeftIcon size={24} color={slate900} />
    </TouchableOpacity>
  );
};

export default BackButton;
