import Location from "@sure-walk/utils/types/location";
import { createContext, useContext, useState } from "react";

interface RideContextType {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  setPickupLocation: (location: Location | null) => void;
  setDropoffLocation: (location: Location | null) => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const useRideSession = () => {
  const value = useContext(RideContext);
  if (!value) {
    throw new Error("useRideSession must be used within a RideProvider");
  }
  return value;
};

export const RideProvider = ({ children }: { children: React.ReactNode }) => {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);

  return (
    <RideContext.Provider
      value={{
        pickupLocation,
        dropoffLocation,
        setPickupLocation,
        setDropoffLocation,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};
