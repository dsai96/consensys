"use client";

import { UserProvider } from "@/contexts/UserContexts";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
