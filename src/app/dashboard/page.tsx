export const dynamic = "force-dynamic";

import React from "react";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserProvider } from "@/context/user-context";
import DashboardClient from "./dashboard-client";

async function DashboardPage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  return <DashboardClient />;
}

export default DashboardPage;
