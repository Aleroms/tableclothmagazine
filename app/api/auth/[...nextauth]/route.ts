import NextAuth, { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { getUserByEmail } from "@/app/lib/database/query";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Table Credentials",
      // `credentials` is used to generate a form on the sign in page.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@mail.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        // logic to look up the user from the credentials supplied
        if (!credentials) return null;

        const user = await getUserByEmail(credentials.email);

        if (!user) return null;

        const isValid = await compare(credentials.password, user.password);

        console.log(isValid);
        if (!isValid) return null;

        // Any object returned will be saved in `user` property of the JWT
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          auth_level: user.auth_level,
        };
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, user }) {
      if (user && "auth_level" in user && "role" in user) {
        token.id = user.id;
        token.role = user.role;
        token.auth_level = user.auth_level;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.auth_level = token.auth_level as "admin" | "team" | "basic";
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

/* 
credentials:
https://next-auth.js.org/providers/credentials?utm_source=chatgpt.com
*/
