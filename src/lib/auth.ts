import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  // this line bcz of prisma adapter
  adapter: PrismaAdapter(prisma),
  // how we manage sessions there can be jwt and database
  session: {
    strategy: "jwt",
  },

  providers: [
    //for now credentials provider is for learning
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize called with:", credentials);
        // This is where you normally check DB.
        // For now, we hardcode one demo user for learning:

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        // demo user
        const DEMO_EMAIL = "demo@example.com";
        const DEMO_PASSWORD = "demo123";

        if (
          credentials.email === DEMO_EMAIL &&
          credentials.password === DEMO_PASSWORD
        ) {
          // This object becomes "user" in session
          return {
            id: "demo-user-id",
            name: "Demo User",
            email: DEMO_EMAIL,
          };
        }

        // If credentials don't match, return null and error on login page
        console.log("Invalid credentials");
        return null;
      },
    }),

    //for login through google
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Callbacks let us control what goes into JWT + session
  callbacks: {
    //runs when user tries to login
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        //so prismaadapter handle user and account creation we can remove this logic
        // const email=user.email;
        // if(!email) return false;
        // let existingUser=await prisma.user.findUnique({ where:{email}})
        // //if no existing user lets create
        // if(!existingUser){
        //   existingUser=await prisma.user.create({
        //     data:{
        //       email,
        //       name:user.name,
        //       image:user.image
        //     }
        //   })
        // }
        // user.id=existingUser.id;
        // (user as any).role=existingUser.role;
      }
      return true;
      //allow login or signin
    },

    // this runs when once on signin, and user is defined then we are keeping that user in token so token is there then user is there
    async jwt({ token, user }) {
      // First time login: user is defined
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },

    //controls what will the frontend get from session(use session)
    async session({ session, token }) {
      // Attach token.id to session.user.id
      if (session.user && token.id) {
        //fetch the user from db
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            plan: true,
            credits: true,
            role: true,
          },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.plan = dbUser.plan;
          session.user.credits = dbUser.credits;
          session.user.role = dbUser.role;
        }
      }
      return session;
    },
  },
};

//helper function(every time no need to import authoptions get server session in all the components just write session=await getServerAuthSession())
export const getServerAuthSession = () => getServerSession(authOptions);
