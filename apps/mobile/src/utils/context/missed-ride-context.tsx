import Location from "@sure-walk/utils/types/location";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useTabContext } from "./tab-context";

type MissedRide = { pickupLocation: Location; dropoffLocation: Location };

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
  const { goMyRide, activeTab } = useTabContext();

  const [missedRide, setMissedRide] = useState<MissedRide | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    // when a missed ride notification is pressed, make sure the tab switches
    // to the my ride page
    if (showModal === true && activeTab === "home") {
      goMyRide();
    }
  }, [showModal, goMyRide]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MissedRideContext.Provider
      value={{ missedRide, setMissedRide, showModal, setShowModal }}
    >
      {children}
    </MissedRideContext.Provider>
  );
};
