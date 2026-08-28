import User from "@sure-walk/utils/types/user";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { createContext } from "react";

import { api, ok } from "@/src/client/session";

import { logout } from "../../client/auth";
import LoadingState from "../types/loading-state";
import { useToastContext } from "./toast-context";

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  logOut: (pushToken: string | undefined) => void;
  loadingState: LoadingState;
  guidelinesAccepted: boolean;
  acceptGuidelines: () => Promise<void>;
  fetchUserInfo: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useSession = () => {
  const value = useContext(UserContext);
  if (!value) {
    throw new Error("useSession must be used within a <UserProvider />");
  }
  return value;
};

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const { setToast } = useToastContext();

  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [guidelinesAccepted, setGuidelinesAccepted] = useState<boolean>(false);

  const fetchUserInfo = async () => {
    const guidelinesAcceptedValue =
      await SecureStore.getItemAsync("guidelinesAccepted");
    setGuidelinesAccepted(guidelinesAcceptedValue === "true");

    const accessToken = await SecureStore.getItemAsync("accessToken");
    if (!accessToken) {
      // no login credentials
      setLoadingState("done");
      return;
    }

    try {
      const userInfoReponse = await api.get("/me");
      if (!ok(userInfoReponse)) {
        throw new Error("Failed to fetch user info");
      }
      const parsedUserData: User = userInfoReponse.data;
      setUserInfo(parsedUserData);
      setLoadingState("done");
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK")
      ) {
        if (loadingState === "error") {
          // retry failed
          setToast({
            title: "Connection failed",
            description: "There was a problem connecting to the server.",
            onDismiss: () => setToast(null),
            isError: true,
          });
        }
        setLoadingState("error");
        return;
      }
      // assume user is logged out
      setToast({
        title: "There was a problem with your login.",
        description: "Please sign in again.",
        onDismiss: () => setToast(null),
        isError: true,
      });
      await SecureStore.deleteItemAsync("guidelinesAccepted");
      setLoadingState("done");
      return;
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider
      value={{
        user: userInfo,
        setUser: setUserInfo,
        logOut: async (pushToken: string | undefined) => {
          try {
            await logout(pushToken);
          } catch (error) {
            console.error("Error occurred while logging out, ignoring:", error);
          }
          setUserInfo(null);
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          await SecureStore.deleteItemAsync("guidelinesAccepted");
        },
        loadingState: loadingState,
        guidelinesAccepted,
        acceptGuidelines: async () => {
          setGuidelinesAccepted(true);
          await SecureStore.setItemAsync("guidelinesAccepted", "true");
        },
        fetchUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
