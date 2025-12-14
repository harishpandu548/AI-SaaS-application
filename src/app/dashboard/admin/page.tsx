import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import AdminClient from "./client";

export default async function AdminPage() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  // if (session.user?.role !== "ADMIN") {
  //   redirect("/");
  // }
  //fetch all the existing users
  const dbUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  // map date to string (ISO) so it matches the client user type
  const users = dbUsers.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(), // if you need updatedAt client side
  }));

  return <AdminClient users={users} />;
}
