import * as Location from "expo-location";
import { useEffect } from "react";
import { Animated, View } from "react-native";
import { Marker } from "react-native-maps";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { UTBurntOrange } from "../utils/colors";

const LocationMarker = ({
  location,
}: {
  location: Location.LocationObject | null;
}) => {
  const pulseScale = useSharedValue(1);
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(0.8, {
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    location && (
      <Marker
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        tracksViewChanges={true}
      >
        <Animated.View
          style={[
            {
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
              margin: 4,
            },
            pulseStyle,
          ]}
        >
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: UTBurntOrange,
            }}
          />
        </Animated.View>
      </Marker>
    )
  );
};

export default LocationMarker;
