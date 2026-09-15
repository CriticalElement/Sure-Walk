import GroupRideMember from "./group-ride-member";
import InProgressRideState from "./in-progress-ride-state";
import Location from "./location";

type CurrentRideSmall = {
  pickupLocation: Location;
  dropoffLocation: Location;
  rideState: InProgressRideState;
  leader: GroupRideMember;
  groupRide: GroupRideMember[];
  shareCode?: string;
  eta?: string;
};

export default CurrentRideSmall;
