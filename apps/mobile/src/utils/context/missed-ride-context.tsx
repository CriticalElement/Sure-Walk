import CurrentRideMini from "@sure-walk/utils/types/current-ride-mini";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useTabContext } from "./tab-context";

interface MissedRideContextType {
  missedRide: CurrentRideMini | null;
  setMissedRide: React.Dispatch<React.SetStateAction<CurrentRideMini | null>>;
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
  const { goMyRide } = useTabContext();

  const [missedRide, setMissedRide] = useState<CurrentRideMini | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    // when a missed ride notification is pressed, make sure the tab switches
    // to the my ride page
    if (showModal === true) {
      goMyRide();
    }
  }, [showModal, goMyRide]);

  return (
    <MissedRideContext.Provider
      value={{ missedRide, setMissedRide, showModal, setShowModal }}
    >
      {children}
    </MissedRideContext.Provider>
  );
};
