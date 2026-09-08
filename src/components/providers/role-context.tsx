"use client";

import * as React from "react";
import type { OrgRole } from "@/types";

interface RoleContextType {
  role: OrgRole;
  setRole: (role: OrgRole) => void;
}

const RoleContext = React.createContext<RoleContextType>({
  role: "ceo",
  setRole: () => {},
});

export function RoleProvider({
  children,
  initialRole = "ceo",
}: {
  children: React.ReactNode;
  initialRole?: OrgRole;
}) {
  const [role, setRole] = React.useState<OrgRole>(initialRole);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useCurrentRole() {
  return React.useContext(RoleContext);
}
