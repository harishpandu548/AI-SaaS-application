"use client";
import { createContext, useContext, useState } from "react";

type UserContextType = {
  name?: string;
  role?: string;
  plan?: string;
  credits: number;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
  initialName,
  initialRole,
  initialPlan,
  initialCredits,
  children,
}: {
  initialName?: string;
  initialRole?: string;
  initialPlan: string;
  initialCredits: number;
  children: React.ReactNode;
}) {
  const [plan, setPlan] = useState(initialPlan);
  const [credits, setCredits] = useState(initialCredits);
  const [name, setName] = useState(initialName);
  const [role, setRole] = useState(initialRole);

  async function refreshUser() {
    const res = await fetch("/api/user/me");
    if (!res.ok) return;

    const data = await res.json();
    setPlan(data.plan);
    setCredits(data.credits);
    setName(data.name);
    setRole(data.role);
  }

  return (
    <UserContext.Provider value={{ plan, credits, name, role, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
}
