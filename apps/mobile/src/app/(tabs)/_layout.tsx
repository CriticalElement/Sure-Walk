import TabScreens from "@/src/components/tab-screens";
import { CurrentRideProvider } from "@/src/utils/context/current-ride-context";
import { GroupRideProvider } from "@/src/utils/context/group-ride-context";
import { MissedRideProvider } from "@/src/utils/context/missed-ride-context";
import { RideProvider } from "@/src/utils/context/ride-context";
import { RideDetailsProvider } from "@/src/utils/context/ride-details-context";

const _layout = () => {
  return (
    <CurrentRideProvider>
      <RideDetailsProvider>
        <MissedRideProvider>
          <RideProvider>
            <GroupRideProvider>
              <TabScreens />
            </GroupRideProvider>
          </RideProvider>
        </MissedRideProvider>
      </RideDetailsProvider>
    </CurrentRideProvider>
  );
};

export default _layout;
