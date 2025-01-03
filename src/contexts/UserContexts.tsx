"use client";

import { AppStatus } from "@/app/components/BannerStatus";
import { User } from "@/services/types";
import React, { createContext, useState, useContext, ReactNode } from "react";

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  status: AppStatus;
  setStatus: (status: AppStatus) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState({ id: 0, name: "" });
  const [status, setStatus] = useState<AppStatus>("Initial");

  return (
    <UserContext.Provider value={{ user, setUser, status, setStatus }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
