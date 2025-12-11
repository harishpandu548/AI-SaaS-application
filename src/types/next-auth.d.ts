import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: "USER" | "ADMIN";
      plan?:"FREE"|"PRO"
      credits?: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: "USER" | "ADMIN";
    credits?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: "USER" | "ADMIN";
    credits?: number;
  }
}
