import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
  TouchableOpacity as TO,
} from "@gorhom/bottom-sheet";
import {
  dropoffBoundaryPolygons,
  pickupBoundaryPolygons,
} from "@sure-walk/utils/boundary-info";
import { getMatchingDropoffLocations } from "@sure-walk/utils/dropoff-locations";
import { getMatchingPickupLocations } from "@sure-walk/utils/pickup-locations";
import LocationType from "@sure-walk/utils/types/location";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { router, useFocusEffect } from "expo-router";
import {
  ArrowCircleRightIcon,
  CircleIcon,
  FadersHorizontalIcon,
  MapPinIcon,
  NavigationArrowIcon,
  StarIcon,
  UserCircleIcon,
  UserCirclePlusIcon,
} from "phosphor-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Polygon } from "react-native-maps";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { api } from "@/src/client/session";
import CheckButton from "@/src/components/check-button";
import FontText from "@/src/components/font-text";
import LargeButton from "@/src/components/large-button";
import LocationMarker from "@/src/components/location-marker";
import OutlineButton from "@/src/components/outline-button";
import PickupDropoffLocationInfo from "@/src/components/pickup-dropoff-location-info";
import TertiaryButton from "@/src/components/tertiary-button";
import TextInputField from "@/src/components/text-input-field";
import {
  gray900,
  slate700,
  slate900,
  UTBluebonnet,
  UTBurntOrange,
  UTTangerine,
  UTTurquoise,
} from "@/src/utils/colors";
import { useCurrentRideSession } from "@/src/utils/context/current-ride-context";
import { useGroupRideSession } from "@/src/utils/context/group-ride-context";
import { useMissedRideSession } from "@/src/utils/context/missed-ride-context";
import { usePushNotificationsContext } from "@/src/utils/context/push-notifications-context";
import { useRideSession } from "@/src/utils/context/ride-context";
import { useToastContext } from "@/src/utils/context/toast-context";

const Home = () => {
  let _style: StyleProp<TextStyle> = { fontSize: 16 };
  if (Platform.OS === "ios") {
    _style.lineHeight = 0;
  }

  const { members } = useGroupRideSession();
  const {
    pickupLocation,
    setPickupLocation,
    dropoffLocation,
    setDropoffLocation,
  } = useRideSession();
  const { currentRide, setCurrentRide } = useCurrentRideSession();
  const { missedRide, setMissedRide, showModal, setShowModal } =
    useMissedRideSession();
  const { registerForPushNotificationsAsync } = usePushNotificationsContext();
  const { setToast } = useToastContext();

  const [code, setCode] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);

  const inputRef = useRef<TextInput>(null);

  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const startLocationRef = useRef<TextInput>(null);
  const destinationRef = useRef<TextInput>(null);
  const rideCodeSheetRef = useRef<BottomSheetModal>(null);

  const snap0 = useSharedValue<number>(92);
  const snap1 = useSharedValue<number>(290);
  const snapPoints = useDerivedValue(
    () => [
      snap0.value + 24, // compensate for screen safe area
      snap1.value + snap0.value,
      ...(!currentRide ? ["80.5%"] : []),
    ],
    [snap0, snap1, currentRide],
  );

  const [snapIndex, setSnapIndex] = useState<number>(1);
  const [legendOpen, setLegendOpen] = useState<boolean>(false);
  const [showPickupBoundary, setPickupBoundary] = useState<boolean>(true);
  const [showDropoffBoundary, setDropoffBoundary] = useState<boolean>(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [userLocationLabel, setUserLocationLabel] =
    useState<string>("Loading...");
  const [startLocationText, setStartLocationText] = useState<string>(
    pickupLocation?.name ?? "",
  );
  const [destinationText, setDestinationText] = useState<string>(
    dropoffLocation?.name ?? "",
  );
  const [focusedInput, setFocusedInput] = useState<"pickup" | "dropoff">(
    "pickup",
  );
  const [, setIsInputFocused] = useState<boolean>(false);
  const [pickupList, setPickupList] = useState<LocationType[]>([]);
  const [dropoffList, setDropoffList] = useState<LocationType[]>([]);
  const [startLocationAddress, setStartAddress] = useState<string>(
    pickupLocation?.address ?? "Select your pickup location",
  );
  const [destinationAddress, setDestinationAddress] = useState<string>(
    dropoffLocation?.address ?? "Select your destination",
  );

  const centerMapOnLocation = (location: Location.LocationObject) => {
    setTimeout(() => {
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude - 0.0038,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }, 1000);
  };

  useEffect(() => {
    async function requestLocationPermissions() {
      let { status: currentStatus } =
        await Location.getForegroundPermissionsAsync();
      let finalStatus = currentStatus;
      if (currentStatus !== "granted") {
        let { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }

      mapRef.current?.animateToRegion(
        {
          latitude: 30.282962,
          longitude: -97.737224,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        0,
      );

      if (finalStatus !== "granted") {
        console.error("location denied");
        return;
      } else {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        setLocation(location);
        centerMapOnLocation(location);

        const userLat = location.coords.latitude;
        const userLon = location.coords.longitude;
        console.log("[Location] GPS coordinates:", userLat, userLon);

        const haversine = (
          lat1: number,
          lon1: number,
          lat2: number,
          lon2: number,
        ) => {
          const toRad = (v: number) => (v * Math.PI) / 180;
          const dLat = toRad(lat2 - lat1);
          const dLon = toRad(lon2 - lon1);
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
              Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
          return Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };

        const allPickupLocations = getMatchingPickupLocations("");
        if (allPickupLocations.length > 0) {
          const nearest = allPickupLocations.reduce((closest, loc) =>
            haversine(userLat, userLon, loc.lat, loc.lon) <
            haversine(userLat, userLon, closest.lat, closest.lon)
              ? loc
              : closest,
          );
          const { latitude, longitude } = location.coords;
          const dist = Math.hypot(
            latitude - nearest.lat,
            longitude - nearest.lon,
          );
          if (dist > 0.001) {
            setUserLocationLabel("Off-Campus");
            return;
          }
          console.log(
            "[Location] Selected nearest:",
            nearest.name,
            `(id=${nearest.id})`,
          );
          if (startLocationText === "") {
            // if the user has started editing ignore this
            setStartLocationText(nearest.name);
            setStartAddress(nearest.address);
            setPickupLocation(nearest);
            setUserLocationLabel(nearest.name);
            setFocusedInput("dropoff");
          }
        }
      }
    }

    registerForPushNotificationsAsync();
    requestLocationPermissions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPickupList(getMatchingPickupLocations(startLocationText));
  }, [startLocationText]);

  useEffect(() => {
    setDropoffList(getMatchingDropoffLocations(destinationText));
  }, [destinationText]);

  useFocusEffect(
    useCallback(() => {
      if (pickupLocation) {
        setStartLocationText(pickupLocation.name);
        setStartAddress(pickupLocation.address);
      }
      if (dropoffLocation) {
        setDestinationText(dropoffLocation.name);
        setDestinationAddress(dropoffLocation.address);
      }
    }, [pickupLocation, dropoffLocation]),
  );

  useEffect(() => {
    if (!currentRide) {
      setStartLocationText("");
      setDestinationText("");
      setStartAddress("Select your pickup location");
      setDestinationAddress("Select your destination");
    } else {
      sheetRef.current?.snapToIndex(1);
    }
  }, [currentRide]);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        handleMissedRideNotificationResponse,
      );

    return () => {
      responseListener.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.route &&
      lastNotificationResponse.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      handleMissedRideNotificationResponse(lastNotificationResponse);
    }
  }, [lastNotificationResponse]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchCurrentRide = async () => {
      try {
        const res = await api.get("/ride");
        if (res.status === 204) {
          setCurrentRide(null);
        } else if (res.status === 200) {
          setCurrentRide(res.data);
        } else {
          throw new Error("Could not fetch current ride details.");
        }
      } catch (err) {
        // ignore error, could be because app minimized
        console.log(err);
      }
    };

    const interval = setInterval(fetchCurrentRide, 30 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMissedRideNotificationResponse = (
    response: Notifications.NotificationResponse,
  ) => {
    const data = response.notification.request.content.data;
    if (data.eventType === "missedRide") {
      Notifications.clearLastNotificationResponseAsync();
      setCurrentRide(null);
      setMissedRide({
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
      });
      setTimeout(() => setShowModal(true), 300);
    }
  };

  const calcMinimizedSheetHeight = (event: LayoutChangeEvent) => {
    let height = event.nativeEvent.layout.height;
    if (height === 0) {
      height = 92;
    }
    snap0.set(height);
  };

  const calcMediumSheetHeight = (event: LayoutChangeEvent) => {
    let height = event.nativeEvent.layout.height;
    if (height === 0) {
      height = 290;
    }
    if (!currentRide) {
      height -= 16; // compensate for list inner shadow negative margin
    }
    snap1.set(height);
  };

  // const resetMapView = (location: LocationType) => {
  //   setPickupList([]);
  //   setDropoffList([]);
  //   mapRef.current?.animateToRegion(
  //     {
  //       latitude: location.lat,
  //       longitude: location.lon,
  //       latitudeDelta: 0.02,
  //       longitudeDelta: 0.02,
  //     },
  //     500,
  //   );
  // };

  const clickedPickupLocation = (location: LocationType) => () => {
    setStartLocationText(location.name);
    setStartAddress(location.address);
    setPickupLocation(location);
    setFocusedInput("dropoff");
    if (dropoffLocation) {
      startLocationRef.current?.blur();
      router.navigate("/home/confirm-ride");
    } else if (startLocationRef.current?.isFocused()) {
      destinationRef.current?.focus();
    }
  };

  const clickedDropoffLocation = (location: LocationType) => () => {
    setDestinationText(location.name);
    setDestinationAddress(location.address);
    setDropoffLocation(location);
    destinationRef.current?.blur();
    if (pickupLocation) {
      router.navigate("/home/confirm-ride");
    }
  };

  return (
    <View className="bg-white flex-1 flex-col items-center pt-safe">
      <View className="relative pt-3 pb-8 px-5 w-full">
        <View className="flex-col items-center justify-center gap-1">
          <View className="flex-row justify-center items-center gap-1">
            <NavigationArrowIcon
              color={UTBurntOrange}
              size="16"
              weight="fill"
              mirrored
            />
            <FontText className="font-medium text-3.5 text-slate-700">
              Your Location
            </FontText>
          </View>
          <FontText className="font-medium text-4 text-center">
            {userLocationLabel}
          </FontText>
        </View>
        <TouchableOpacity
          className="absolute left-5 top-3 p-3 items-center justify-center rounded-2xl bg-slate-100"
          onPress={() => {
            if (snapIndex === 2) sheetRef.current?.snapToIndex(1);
            setLegendOpen(!legendOpen);
          }}
        >
          <FadersHorizontalIcon color={slate700} size="24" />
        </TouchableOpacity>
        <TouchableOpacity
          className="absolute right-5 top-3 p-3 items-center justify-center rounded-2xl bg-slate-100"
          onPress={() => {
            router.navigate("/profile");
          }}
        >
          <UserCircleIcon color={slate700} size="24" />
        </TouchableOpacity>
      </View>
      <View className="relative flex-1 w-full">
        <View className="w-full h-full mt-[-10px] items-center justify-center">
          <MapView
            ref={mapRef}
            style={{ width: "100%", flex: 1, zIndex: 0 }}
            initialRegion={{
              latitude: 30.282962,
              longitude: -97.737224,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            mapPadding={{
              bottom: 92,
              top: 20,
              left: 0,
              right: 0,
            }}
            tintColor={UTBurntOrange}
            userInterfaceStyle="light"
          >
            {pickupBoundaryPolygons.map((coords, index) => (
              <Polygon
                coordinates={coords}
                key={index}
                fillColor={
                  showPickupBoundary ? `${UTTangerine}30` : "#00000000"
                }
                strokeColor={
                  showPickupBoundary ? UTTangerine : "rgba(0, 0, 0, 0)"
                }
              />
            ))}
            {dropoffBoundaryPolygons.map((coords, index) => (
              <Polygon
                coordinates={coords}
                holes={
                  index === 0
                    ? [
                        [
                          {
                            latitude: 30.289121 + 0.00001,
                            longitude: -97.7429238 - 0.00001,
                          },
                          {
                            latitude: 30.2883058 - 0.00001,
                            longitude: -97.7430042 - 0.00001,
                          },
                          {
                            latitude: 30.2882641 - 0.00001,
                            longitude: -97.7423873 + 0.00001,
                          },
                          {
                            latitude: 30.2890701 + 0.00001,
                            longitude: -97.7423283 + 0.00001,
                          },
                          {
                            latitude: 30.289121 + 0.00001,
                            longitude: -97.7429238 - 0.00001,
                          },
                        ],
                        [
                          {
                            latitude: 30.2888591 + 0.00001,
                            longitude: -97.7437415 - 0.00001,
                          },
                          {
                            latitude: 30.287935 - 0.00001,
                            longitude: -97.743838 - 0.00001,
                          },
                          {
                            latitude: 30.2878887 - 0.00001,
                            longitude: -97.7431889 + 0.00001,
                          },
                          {
                            latitude: 30.288822 + 0.00001,
                            longitude: -97.7430897 + 0.00001,
                          },
                          {
                            latitude: 30.2888591 + 0.00001,
                            longitude: -97.7437415 - 0.00001,
                          },
                        ],
                      ]
                    : undefined
                }
                key={index}
                fillColor={
                  showDropoffBoundary ? `${UTTurquoise}30` : "#00000000"
                }
                strokeColor={
                  showDropoffBoundary ? UTTurquoise : "rgba(0, 0, 0, 0)"
                }
              />
            ))}
            <LocationMarker location={location} />
          </MapView>
        </View>
        <LinearGradient
          colors={["#ffffffff", "#ffffff00"]}
          style={{
            position: "absolute",
            top: -10,
            left: 0,
            right: 0,
            height: 24,
          }}
        />
        {legendOpen && (
          <>
            <Animated.View
              className="absolute top-[28px] right-5 px-4 py-2 bg-white rounded-full border border-slate-200 flex-row justify-end"
              entering={FadeInUp.duration(150).easing(Easing.out(Easing.cubic))}
              exiting={FadeOutUp.duration(150).easing(Easing.in(Easing.cubic))}
            >
              <CheckButton
                label="Pickup & Drop-Off Boundary"
                onPress={() => setPickupBoundary(!showPickupBoundary)}
                isChecked={showPickupBoundary}
                color={UTTangerine}
              />
            </Animated.View>
            <Animated.View
              className="absolute top-[70px] right-5 mt-2.5 px-4 py-2 bg-white rounded-full border border-slate-200 flex-row"
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
                color={UTTurquoise}
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
        style={{
          borderRadius: 28,
          backgroundColor: "transparent",
          zIndex: 150,
        }}
        onChange={(index) => {
          if (index !== 2) {
            startLocationRef.current?.blur();
            destinationRef.current?.blur();
          }
          setSnapIndex(index);
        }}
        handleComponent={() => (
          <View
            className="relative flex-col rounded-t-[28px]"
            onLayout={calcMinimizedSheetHeight}
          >
            <View className="rounded-t-[28px] flex-col items-center py-4">
              <View className="bg-slate-300 rounded w-8 h-1" />
            </View>
            <View className="flex-col gap-5 px-5 pb-1">
              <View className="flex-row w-full justify-between items-center h-12">
                <FontText className="text-2xl font-medium">
                  {currentRide ? "Ride in Progress" : "Book a ride"}
                </FontText>
                {!currentRide && (
                  <TertiaryButton
                    title={`${members.length === 0 ? "Add" : members.length + 1} Riders`}
                    icon={<UserCirclePlusIcon color={slate700} size="24" />}
                    onPress={() => router.navigate("/home/group-ride")}
                  />
                )}
              </View>
            </View>
          </View>
        )}
        containerStyle={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {pickupLocation && dropoffLocation && !currentRide && (
          <Animated.View
            className="absolute bottom-0 w-full z-10 px-5 mb-safe pb-[80px]"
            entering={FadeInDown.duration(300)
              .delay(300)
              .easing(Easing.out(Easing.cubic))}
            exiting={FadeOutDown.duration(300).easing(Easing.in(Easing.cubic))}
          >
            <LargeButton
              title="Continue"
              onPress={() => router.navigate("/home/confirm-ride")}
            />
          </Animated.View>
        )}
        <View className="flex-col mb-[-24px]" onLayout={calcMediumSheetHeight}>
          <View className="flex-col bg-white pt-4 px-5">
            {!currentRide && (
              <View className="flex-col rounded-lg">
                <Pressable
                  className={`${focusedInput === "pickup" ? "bg-slate-100" : "bg-slate-50"} transition-colors flex-row p-4 gap-4 items-center rounded-t-2xl border border-slate-200`}
                  onPress={() => startLocationRef.current?.focus()}
                >
                  <View className="bg-[#BF570033] rounded-full items-center justify-center w-[32px] h-[32px]">
                    <CircleIcon color={UTBurntOrange} weight="fill" size="20" />
                  </View>
                  <View className="flex-1 flex-col gap-1">
                    <TextInput
                      ref={startLocationRef}
                      onFocus={() => {
                        setFocusedInput("pickup");
                        setIsInputFocused(true);
                        snapIndex !== 2 && sheetRef.current?.expand();
                      }}
                      onBlur={() => setIsInputFocused(false)}
                      className="font-medium text-lg"
                      placeholder="Where from?"
                      placeholderTextColor={gray900}
                      onChangeText={(text) => {
                        setStartLocationText(text);
                        if (!startLocationAddress.startsWith("Select")) {
                          setStartAddress("Select your pickup location");
                          setPickupLocation(null);
                        }
                      }}
                      value={startLocationText}
                      style={_style}
                    />
                    <FontText className="text-lg color-[#333F48]">
                      {startLocationAddress}
                    </FontText>
                  </View>
                </Pressable>
                <Pressable
                  className={`${focusedInput === "dropoff" ? "bg-slate-100" : "bg-slate-50"} transition-colors flex-row p-4 gap-4 items-center rounded-b-2xl border border-slate-200 mt-[-1px] mb-4`}
                  onPress={() => destinationRef.current?.focus()}
                >
                  <View className="bg-[#005F8633] rounded-full items-center justify-center w-[32px] h-[32px]">
                    <MapPinIcon color={UTBluebonnet} size="20" weight="fill" />
                  </View>
                  <View className="flex-1 flex-col gap-1">
                    <TextInput
                      ref={destinationRef}
                      onFocus={() => {
                        setFocusedInput("dropoff");
                        setIsInputFocused(true);
                        snapIndex !== 2 && sheetRef.current?.expand();
                      }}
                      onBlur={() => setIsInputFocused(false)}
                      className="font-medium text-lg"
                      placeholder="Where to?"
                      placeholderTextColor={gray900}
                      onChangeText={(text) => {
                        setDestinationText(text);
                        if (!destinationAddress.startsWith("Select")) {
                          setDestinationAddress("Select your destination");
                          setDropoffLocation(null);
                        }
                      }}
                      value={destinationText}
                      style={_style}
                    />
                    <FontText className="text-lg color-[#333F48]">
                      {destinationAddress}
                    </FontText>
                  </View>
                </Pressable>
                <TO onPress={() => rideCodeSheetRef.current?.present()}>
                  <FontText className="text-lg mb-safe color-ut-bluebonnet">
                    Have a ride code?
                  </FontText>
                </TO>
              </View>
            )}
            {currentRide && (
              <View className="flex-col gap-4 mb-safe">
                <View className="pb-4 bg-slate-50 rounded-2xl border border-slate-200 flex-col gap-2">
                  <View className="flex-row items-center gap-2 mb-2 px-5 py-1.5 bg-orange-100 rounded-t-2xl">
                    <FontText className="text-lg font-semibold color-ut-burntorange">
                      {currentRide.pickupLocation?.abbreviation}
                    </FontText>
                    <ArrowCircleRightIcon
                      weight="fill"
                      color={UTBurntOrange}
                      size={24}
                    />
                    <FontText className="text-lg font-semibold color-ut-burntorange">
                      {currentRide.dropoffLocation?.name}
                    </FontText>
                  </View>
                  {currentRide.eta && (
                    <FontText className="text-lg font-semibold px-5">
                      ETA:{" "}
                      <FontText className="text-lg font-regular">
                        {currentRide.eta ?? ""}
                      </FontText>
                    </FontText>
                  )}
                  <FontText className="text-lg font-semibold px-5">
                    Status:{" "}
                    <FontText className="text-lg font-regular">
                      {`${currentRide.rideState.at(0)?.toUpperCase()}${currentRide.rideState.slice(1)}`}
                    </FontText>
                  </FontText>
                </View>
                <LargeButton
                  title="View Live Tracking"
                  onPress={() => {
                    setDisabled(true);
                    setTimeout(
                      () => router.push("/home/current-ride-info"),
                      300,
                    );
                    setTimeout(() => setDisabled(false), 1000);
                  }}
                  disabled={disabled}
                />
              </View>
            )}
          </View>
          {!currentRide && (
            <LinearGradient
              colors={["#ffffffff", "#ffffff00"]}
              style={{
                marginTop: -12,
                height: 24,
                zIndex: 50,
              }}
            />
          )}
        </View>
        {!currentRide && (
          <BottomSheetFlatList
            overScrollMode={"always"}
            scrollEnabled={
              Platform.OS === "android" ? snapIndex === 2 : undefined
            }
            data={
              focusedInput === "pickup" && startLocationText.trim().length >= 1
                ? pickupList
                : focusedInput === "dropoff" &&
                    destinationText.trim().length >= 1
                  ? dropoffList
                  : []
            }
            keyboardShouldPersistTaps="handled"
            renderItem={({ index, item }) => (
              <TouchableOpacity
                key={index}
                onPress={
                  focusedInput === "pickup"
                    ? clickedPickupLocation(item)
                    : clickedDropoffLocation(item)
                }
              >
                <View
                  key={index}
                  className={`flex-col ${index === (focusedInput === "pickup" ? pickupList : dropoffList).length - 1 ? "" : "border-b"} border-gray-200 pb-4 pt-2`}
                >
                  <View className="flex-row gap-2 items-center">
                    <MapPinIcon color={slate900} size="24" />
                    <View className="flex-1 flex-col gap-2 justify-around">
                      <FontText className="font-medium text-lg/1">
                        {item.name}
                      </FontText>
                      <FontText className="font-regular text-[14px]/1 text-gray-500">
                        {item.address}
                      </FontText>
                    </View>
                    <StarIcon color={slate900} size="24" />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              (((focusedInput === "pickup" &&
                startLocationText.trim().length >= 1) ||
                (focusedInput === "dropoff" &&
                  destinationText.trim().length >= 1)) && (
                <TouchableOpacity
                  onPress={() =>
                    focusedInput === "pickup"
                      ? (setStartLocationText(""),
                        setStartAddress("Select your pickup location"),
                        setPickupLocation(null))
                      : (setDestinationText(""),
                        setDestinationAddress("Select your destination"),
                        setDropoffLocation(null))
                  }
                >
                  <FontText className="mt-4 mb-safe">
                    Clear {focusedInput} selection
                  </FontText>
                </TouchableOpacity>
              )) || <View />
            }
            contentContainerStyle={{
              paddingTop: 8,
              position: "relative",
              paddingHorizontal: 20,
              flexDirection: "column",
              gap: 4,
              justifyContent: "flex-start",
            }}
            style={{
              flexGrow: 1,
            }}
          />
        )}
      </BottomSheet>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={rideCodeSheetRef}
          handleComponent={() => (
            <View className="rounded-t-[28px] flex-col items-center py-4">
              <View className="bg-slate-300 rounded w-8 h-1" />
            </View>
          )}
          backdropComponent={() => (
            <Pressable
              className="absolute inset-0 bg-[#00000080]"
              onPress={() => rideCodeSheetRef.current?.dismiss()}
            />
          )}
        >
          <BottomSheetView className="px-5 pb-safe">
            <FontText className="text-2xl font-medium">Join a Ride</FontText>
            <FontText className="text-lg font-normal mt-2 mb-6">
              Enter the ride code shared by your group leader.
            </FontText>
            <TextInputField
              placeholder="ABC1234"
              autoCapitalize={"characters"}
              value={code}
              onChangeText={(text) => setCode(text.toUpperCase())}
              inputRef={inputRef}
              returnKeyType="go"
              onSubmitEditing={() => {
                if (code.length !== 7) {
                  setToast({
                    title: "Invalid Code",
                    description: "Please enter a valid 7-digit ride code.",
                    onDismiss: () => setToast(null),
                    isError: true,
                  });
                  return;
                }
                router.push(`/home/current-ride-info?shareCode=${code}`);
              }}
              InputComponent={BottomSheetTextInput}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <View className="absolute inset-0 flex-1">
        <Modal
          animationType="fade"
          transparent
          visible={showModal}
          statusBarTranslucent={true}
          onRequestClose={() => setShowModal(false)}
          className="z-1000"
        >
          <Pressable
            className="flex-1 bg-[#00000080] items-center justify-center p-5"
            onPress={() => setShowModal(false)}
          >
            <Pressable className="py-6 px-7 bg-white flex-col gap-4 rounded-3xl w-full">
              <FontText className="text-2xl font-medium">Missed Ride</FontText>
              <View className="flex-col gap-3">
                <FontText className="text-lg">
                  You have missed the following ride:
                </FontText>
                <View className="mb-3">
                  <PickupDropoffLocationInfo
                    pickupLocation={missedRide?.pickupLocation ?? null}
                    dropoffLocation={missedRide?.dropoffLocation ?? null}
                  />
                </View>
                <OutlineButton
                  title="Book a New Ride"
                  onPress={() => setShowModal(false)}
                  medium
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </View>
  );
};

export default Home;
