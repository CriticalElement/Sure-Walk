import GroupRideMember from "@sure-walk/utils/types/group-ride-member";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

interface GroupRideContextType {
  // the group ride leader is the currently signed in user, use user-context to get that value
  members: GroupRideMember[];
  removeMember: (memberIndex: number) => void;
  addMember: (member: GroupRideMember) => void;
  setMembers: (members: GroupRideMember[]) => void;
  clearMembers: () => void;
  lastRideMembers: GroupRideMember[];
  setLastRideMembers: (members: GroupRideMember[]) => void;
}

const GroupRideContext = createContext<GroupRideContextType | undefined>(
  undefined,
);

export const useGroupRideSession = () => {
  const value = useContext(GroupRideContext);
  if (!value) {
    throw new Error(
      "useGroupRideSession must be used within a GroupRideProvider",
    );
  }
  return value;
};

export const GroupRideProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [members, setMembers] = useState<GroupRideMember[]>([]);
  const [lastRideMembers, setLastRideMembers] = useState<GroupRideMember[]>([]);

  const removeMember = (memberIndex: number) => {
    setMembers(members.filter((_, index) => index !== memberIndex));
  };

  const addMember = (member: GroupRideMember) => {
    setMembers([...members, member]);
  };

  const clearMembers = () => {
    setMembers([]);
  };

  useEffect(() => {
    const getLastRide = async () => {
      const ride = await SecureStore.getItemAsync("lastGroupRide");
      try {
        setLastRideMembers(JSON.parse(ride ?? "[]"));
      } catch {
        // invalid JSON, just ignore
        await SecureStore.deleteItemAsync("lastGroupRide");
      }
    };

    getLastRide();
  }, []);

  return (
    <GroupRideContext.Provider
      value={{
        members,
        removeMember,
        addMember,
        setMembers,
        clearMembers,
        lastRideMembers,
        setLastRideMembers,
      }}
    >
      {children}
    </GroupRideContext.Provider>
  );
};
