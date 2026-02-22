import { View, Text } from "react-native";
import {
  ClockIcon,
  UsersIcon,
  MapPinIcon,
  WarningIcon,
  TimerIcon,
  MoonIcon,
  HamburgerIcon,
  XCircleIcon,
  IconContext,
} from "phosphor-react-native";

const GuidelinesList = ({ includeBottomBorder = false }) => {
  const guidelines = [
    {
      icon: <ClockIcon />,
      title: "Hours of Operation",
      description:
        "We operate from 7 PM to 2 AM, we won’t accept any requests that are not within this time frame.",
    },
    {
      icon: <UsersIcon />,
      title: "Rideshare Service",
      description:
        "This is a free service available to everyone, you may be in a vehicle with others.",
    },
    {
      icon: <MapPinIcon />,
      title: "Pick Up/Drop Off Boundaries",
      description:
        "• Pickups: Must begin from an on-campus location \n• Drop-offs: Allowed to West Campus, off-campus neighborhoods within the service area, or to another on-campus location \n• Sure Walk does not provide rides to any food establishment",
    },
    {
      icon: <WarningIcon />,
      title: "No Booking in Advance",
      description:
        "Book when you are ready to be picked up. We do not offer advance reservations.",
    },
    {
      icon: <TimerIcon />,
      title: "2-Minute Wait Period",
      description:
        "If you are not at your pickup location within 2 minutes of your scheduled pickup time, your request will be canceled.",
    },
    {
      icon: <MoonIcon />,
      title: "Disable 'Do Not Disturb'",
      description:
        "Please disable 'Do Not Disturb' mode on your phone to ensure you receive notifications from Sure Walk.",
    },
    {
      icon: <HamburgerIcon />,
      title: "No Food or Drink in the Vehicles",
      description:
        "To keep our vehicles clean, please avoid bringing any food or drinks.",
    },
    {
      icon: <XCircleIcon />,
      title: "Cancellations",
      description:
        "If you need to cancel your ride, do so through the app prior to your vehicle’s arrival.",
    },
  ];

  return (
    <IconContext.Provider
      value={{ color: "#BF5700", size: 21, weight: "bold" }}
    >
      <View className="flex-1 gap-5 p-5 pt-8">
        <Text className="text-gray-950 text-2xl font-medium leading-none">
          Information and Guidelines
        </Text>
        <View className="flex-1 gap-3.5 justify-start">
          {guidelines.map((guideline, index) => (
            <View key={index} className="gap-2">
              <View className="flex-row gap-2 items-center">
                {guideline.icon}
                <Text className="text-gray-900 text-xl font-semibold leading-[26px]">
                  {guideline.title}
                </Text>
              </View>
              <View
                className={`ms-8 me-8 pb-3.5 ${includeBottomBorder || index < guidelines.length - 1 ? "border-b border-gray-300" : ""}`}
              >
                <Text className="text-gray-900 text-lg leading-normal">
                  {guideline.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </IconContext.Provider>
  );
};

export default GuidelinesList;
