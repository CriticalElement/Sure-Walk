import InProgressRideState from "./in-progress-ride-state";
import VehicleInfoShort from "./vehicle-info-short";

type RideUpdateNotification = {
  route: string;
  rideState: InProgressRideState | undefined;
  vehicleInfo: VehicleInfoShort | undefined;
  eventType: "routeUpdate" | "vehicleInfo";
};

export default RideUpdateNotification;
