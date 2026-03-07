import FontText from "@/src/components/font-text";
import {
  CircleIcon,
  FadersHorizontalIcon,
  MapPinIcon,
  NavigationArrowIcon,
  StarIcon,
  UserCirclePlusIcon,
} from "phosphor-react-native";
import { useMemo, useRef, useState } from "react";
import {
  Platform,
  StyleProp,
  TextInput,
  TextStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  TouchableOpacity as TO,
} from "@gorhom/bottom-sheet";
import Animated, { Easing, FadeInUp, FadeOutUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import CheckButton from "@/src/components/check-button";

const Home = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const destinationRef = useRef<TextInput>(null);
  const { height } = useWindowDimensions();
  const snapPoints = useMemo(
    () => [`${(104 / height) * 100}%`, `${(320 / height) * 100}%`, "90%"],
    [height],
  );
  const [snapIndex, setSnapIndex] = useState<number>(1);
  const [legendOpen, setLegendOpen] = useState<boolean>(false);
  const [showPickupBoundary, setPickupBoundary] = useState<boolean>(false);
  const [showDropoffBoundary, setDropoffBoundary] = useState<boolean>(false);

  const [destinationText, setDestinationText] = useState<string>("");

  let _style: StyleProp<TextStyle> = {};
  if (Platform.OS === "ios") {
    _style.lineHeight = 0;
  }

  return (
    <View className="bg-white flex-1 flex-col items-center">
      <View className="relative flex-col items-center justify-center pt-3 pb-1.5 px-5 w-full">
        <View className="flex-col items-center justify-center gap-1">
          <View className="flex-row justify-center items-center gap-1">
            <NavigationArrowIcon
              color="#BF5700"
              size="16"
              weight="fill"
              mirrored
            />
            <FontText className="font-medium text-3.5 text-slate-700">
              Your Location
            </FontText>
          </View>
          <FontText className="font-medium text-4 text-center">
            Perry-Castañeda Library
          </FontText>
        </View>
        <TouchableOpacity
          className="absolute right-5 top-3 p-3 items-center justify-center rounded-2xl bg-slate-50"
          onPress={() => {
            if (snapIndex == 2) sheetRef.current?.snapToIndex(1);
            setLegendOpen(!legendOpen);
          }}
        >
          <FadersHorizontalIcon color="#334155" size="24" />
        </TouchableOpacity>
      </View>
      <View className="relative flex-1 bg-slate-100 w-full">
        <LinearGradient
          colors={["#ffffffff", "#ffffff00"]}
          style={{
            position: "fixed",
            height: 34,
            zIndex: 100,
          }}
        />
        {legendOpen && (
          <>
            <Animated.View
              className="absolute top-[38px] right-5 px-4 py-2 bg-white rounded-full border border-slate-200 flex-row justify-end"
              entering={FadeInUp.duration(150).easing(Easing.out(Easing.cubic))}
              exiting={FadeOutUp.duration(150).easing(Easing.in(Easing.cubic))}
            >
              <CheckButton
                label="Pickup Boundary"
                onPress={() => setPickupBoundary(!showPickupBoundary)}
                isChecked={showPickupBoundary}
              />
            </Animated.View>
            <Animated.View
              className="absolute top-[80px] right-5 mt-2.5 px-4 py-2 bg-white rounded-full border border-slate-200 flex-row"
              entering={FadeInUp.duration(150)
                .delay(50)
                .easing(Easing.out(Easing.cubic))}
              exiting={FadeOutUp.duration(150)
                .delay(50)
                .easing(Easing.in(Easing.cubic))}
            >
              <CheckButton
                label="Drop-Off Boundary"
                onPress={() => setDropoffBoundary(!showDropoffBoundary)}
                isChecked={showDropoffBoundary}
              />
            </Animated.View>
          </>
        )}
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        index={1}
        style={{ borderRadius: 28, backgroundColor: "transparent" }}
        onChange={(index) => {
          if (index !== 2) {
            destinationRef.current?.blur();
          }
          setSnapIndex(index);
        }}
        handleComponent={() => (
          <View className="relative flex-col rounded-t-[28px]">
            <View className="rounded-t-[28px] flex-col items-center py-4">
              <View className="bg-slate-300 rounded w-8 h-1" />
            </View>
          </View>
        )}
      >
        <BottomSheetScrollView
          stickyHeaderIndices={[0]}
          overScrollMode={"always"}
        >
          <View className="flex-col mb-[-24px]">
            <View className="flex-col bg-white">
              <View className="flex-col gap-5 px-5 pb-5">
                <View className="flex-row w-full justify-between items-center">
                  <FontText className="text-2xl font-medium">
                    Book a ride
                  </FontText>
                  <TO>
                    <View className="flex-row gap-1 p-3 items-center bg-slate-100 rounded-[32px]">
                      <UserCirclePlusIcon color="#334155" size="24" />
                      <FontText className="font-medium">Add Riders</FontText>
                    </View>
                  </TO>
                </View>
              </View>
              <View className="flex-col">
                <View className="bg-white shadow-sm flex-row mx-5 px-4 py-[26.5px] gap-2 items-center rounded-t-lg border border-slate-200">
                  <CircleIcon color="#BF5700" weight="fill" size="24" />
                  <FontText className="font-medium text-base">
                    Perry-Castañeda Library
                  </FontText>
                </View>
                <View className="bg-white shadow-sm flex-row mx-5 px-4 py-[26.5px] gap-2 items-center rounded-b-lg border border-slate-200 mt-[-1px] mb-6">
                  <MapPinIcon color="#0F172A" size="24" weight="fill" />
                  <TextInput
                    ref={destinationRef}
                    onFocus={() =>
                      snapIndex !== 2 && sheetRef.current?.expand()
                    }
                    className="font-medium text-base flex-1"
                    placeholder="Where to?"
                    placeholderTextColor="#6B7280"
                    onChangeText={(text) => setDestinationText(text)}
                    value={destinationText}
                    style={_style}
                  />
                </View>
              </View>
            </View>
            <LinearGradient
              colors={["#ffffffff", "#ffffff00"]}
              style={{
                marginTop: -1,
                height: 24,
                zIndex: 50,
              }}
            />
          </View>
          <View className="relative px-5 pt-4 flex-col gap-4 justify-start">
            {[...Array(20)].map((_, index) => (
              <View
                key={index}
                className="flex-col border-b border-gray-200 pb-4"
              >
                <View className="flex-row gap-2 items-center">
                  <MapPinIcon color="#0F172A" size="24" />
                  <View className="flex-1 flex-col gap-2 justify-between">
                    <FontText className="font-medium text-base">
                      Texan Pearl
                    </FontText>
                    <FontText className="font-regular text-[14px] text-gray-500">
                      2515 Pearl St
                    </FontText>
                  </View>
                  <StarIcon color="#0F172A" size="24" />
                </View>
              </View>
            ))}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default Home;
