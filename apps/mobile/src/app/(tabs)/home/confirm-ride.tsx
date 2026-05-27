import FontText from "@/src/components/font-text";
import LargeButton from "@/src/components/large-button";
import OutlineButton from "@/src/components/outline-button";
import RiderCard from "@/src/components/rider-card";
import { slate700, UTBluebonnet, UTBurntOrange } from "@/src/utils/colors";
import { useGroupRideSession } from "@/src/utils/context/group-ride-context";
import { useRideSession } from "@/src/utils/context/ride-context";
import { useSession } from "@/src/utils/context/user-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  CaretLeftIcon,
  CircleIcon,
  CrownSimpleIcon,
  MapPinIcon,
  PencilLineIcon,
} from "phosphor-react-native";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const ConfirmRide = () => {
  const { pickupLocation, dropoffLocation } = useRideSession();
  const { members } = useGroupRideSession();
  const { user } = useSession();
  const { firstName, lastName, userType, eid } = user!;

  return (
    <View className="bg-white flex-1 p-5 flex-col gap-10">
      <View className="flex-row gap-4 items-center mt-safe">
        <TouchableOpacity
          className="w-12 h-12 rounded-2xl bg-slate-100 items-center justify-center"
          onPress={() => {
            router.back();
          }}
        >
          <CaretLeftIcon size={24} color={slate700} />
        </TouchableOpacity>
        <FontText className="font-medium text-2xl">
          Confirm your booking
        </FontText>
      </View>
      <View className="flex-col gap-6 flex-1">
        <View className="flex-col gap-4">
          <View className="flex-row w-full justify-between items-center">
            <FontText className="text-xl font-semibold">
              Pick-up and drop-off
            </FontText>
            <OutlineButton
              title="Edit"
              icon={<PencilLineIcon size={24} color={UTBluebonnet} />}
              onPress={() => router.back()}
              small
            />
          </View>
          <View className="flex-col bg-white">
            <View className="flex-col rounded-lg">
              <View className="bg-slate-50 flex-row p-4 gap-4 items-center rounded-t-2xl border border-slate-200">
                <View className="bg-[#BF570033] rounded-full items-center justify-center w-[32px] h-[32px]">
                  <CircleIcon color={UTBurntOrange} weight="fill" size="20" />
                </View>
                <View className="flex-1 flex-col gap-1">
                  <FontText className="font-medium text-lg">
                    {pickupLocation?.name}
                  </FontText>
                  <FontText className="text-lg color-[#333F48]">
                    {pickupLocation?.address}
                  </FontText>
                </View>
              </View>
              <View className="bg-slate-50 flex-row p-4 gap-4 items-center rounded-b-2xl border border-slate-200 mt-[-1px] mb-6">
                <View className="bg-[#005F8633] rounded-full items-center justify-center w-[32px] h-[32px]">
                  <MapPinIcon color={UTBluebonnet} size="20" weight="fill" />
                </View>
                <View className="flex-1 flex-col gap-1">
                  <FontText className="font-medium text-lg">
                    {dropoffLocation?.name}
                  </FontText>
                  <FontText className="text-lg color-[#333F48]">
                    {dropoffLocation?.address}
                  </FontText>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-col gap-4 flex-1">
          <View className="flex-row w-full justify-between items-center h-12">
            <FontText className="text-xl font-semibold">Ride members</FontText>
            <OutlineButton
              title="Edit"
              icon={<PencilLineIcon size={24} color={UTBluebonnet} />}
              onPress={() => router.navigate("/home/group-ride")}
              small
            />
          </View>
          <View className="relative p-0 z-5 flex-1">
            <LinearGradient
              colors={["#ffffffff", "#ffffff00"]}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 16,
                zIndex: 10,
              }}
            />
            <LinearGradient
              colors={["#ffffff00", "#ffffffff"]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 20,
                zIndex: 10,
              }}
            />
            <ScrollView
              className="flex-col py-4 pt-[-16px]"
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-col gap-4 pt-3">
                <RiderCard
                  member={{ firstName, lastName, userType, eid }}
                  actionComponent={
                    <CrownSimpleIcon color="#FFD600" size={24} weight="fill" />
                  }
                />
                {members.map((member, index) => (
                  <RiderCard key={index} member={member} />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      <LargeButton title="Confirm" onPress={() => null} />
    </View>
  );
};

export default ConfirmRide;
