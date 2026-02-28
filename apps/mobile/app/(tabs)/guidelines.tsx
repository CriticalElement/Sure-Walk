import { ScrollView } from "react-native";
import GuidelinesList from "@/components/guidelines-list";

const guidelines = () => {
  return (
    <ScrollView className="bg-white flex-1 h-full">
      <GuidelinesList />
    </ScrollView>
  );
};

export default guidelines;
