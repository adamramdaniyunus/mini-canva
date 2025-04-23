import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { supabase } from "./supabase";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("email", credentials.email)
        .maybeSingle();

        // Cek apakah email cocok
        if (!user) {
          throw new Error("Wrong password or email");
        }

        // Cek apakah password cocok
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Wrong password or email");
        }

        return { id: user.id, fullname: user.name, email: user.email, profile: user.profile };
      }

    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();

        if (!existingUser) {
          await supabase
            .from("users")
            .insert({
              email: user.email,
              fullname: user.name,
              profile: user.image,
            })
            .select("*");

          return true;
        }
      }

      return true; // allow sign in
    },

    async session({ session }) {
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user?.email)
        .maybeSingle();


      if (userData) {
        session.user.id = userData.id;
        session.user.email = userData.email;
        session.user.profile = userData.profile;
        session.user.fullname = userData.fullname;
      }

      return session;
    },
  }
};
