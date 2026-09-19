import Location from "@sure-walk/utils/types/location";
import React, { createContext, useContext, useState } from "react";

export type MissedRide = {
  pickupLocation: Location;
  dropoffLocation: Location;
};

interface MissedRideContextType {
  missedRide: MissedRide | null;
  setMissedRide: React.Dispatch<React.SetStateAction<MissedRide | null>>;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const MissedRideContext = createContext<MissedRideContextType | undefined>(
  undefined,
);

export const useMissedRideSession = () => {
  const value = useContext(MissedRideContext);
  if (!value) {
    throw new Error(
      "useMissedRideSession must be used within a MissedRideProvider",
    );
  }
  return value;
};

export const MissedRideProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [missedRide, setMissedRide] = useState<MissedRide | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <MissedRideContext.Provider
      value={{ missedRide, setMissedRide, showModal, setShowModal }}
    >
      {children}
    </MissedRideContext.Provider>
  );
};
