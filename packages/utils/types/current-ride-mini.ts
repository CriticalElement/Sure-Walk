import InProgressRideState from "./in-progress-ride-state";
import Location from "./location";

type CurrentRideMini = {
  pickupLocation: Location;
  dropoffLocation: Location;
  rideState: InProgressRideState;
  eta?: string;
};

export default CurrentRideMini;
