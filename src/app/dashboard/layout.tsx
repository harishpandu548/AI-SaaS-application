import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session || !session.user?.email) redirect("/");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email},
    select: {
      name:true,
      role:true,
      plan: true,
      credits: true,
    },
  });
  //  if user deleted from db then force logout
if (!user) {
  redirect("/api/auth/signout?callbackUrl=/");
}

  return (
    <>
      {children}
    </>
  );
}
