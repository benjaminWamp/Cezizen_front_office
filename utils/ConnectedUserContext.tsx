import React from "react";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { UserType } from "./types/User.types";
import { useUser } from "@clerk/clerk-expo";
import { getUser } from "../services/user.service";

interface UserContextType {
  connectedUser: UserType | undefined;
  userChoseToUnconnect: boolean;
  handleNonConnectedUser: (_: boolean) => void;
}

const ConnectedUserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const ConnectedUserProvider = ({ children }: UserProviderProps) => {
  const [connectedUser, setConnectedUser] = useState<UserType | undefined>(undefined);

  const [userChoseToUnconnect, setUserChoseToUnconnect] = useState<boolean>(false);

  const { user } = useUser();

  const getUserActive = useCallback(async () => {
    let bddUser;

    if (user) {
      bddUser = await getUser(user.id);
      console.log("User from BDD", bddUser.data);

      setConnectedUser(bddUser.data);
      setUserChoseToUnconnect(false);
    }
  }, [user]);

  useEffect(() => {
    getUserActive();
  }, [getUser]);

  const handleNonConnectedUser = (boolean: boolean) => {
    setUserChoseToUnconnect(boolean);
  };

  return <ConnectedUserContext.Provider value={{ connectedUser, userChoseToUnconnect, handleNonConnectedUser }}>{children}</ConnectedUserContext.Provider>;
};

export const useConntedUser = () => {
  const context = useContext(ConnectedUserContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
