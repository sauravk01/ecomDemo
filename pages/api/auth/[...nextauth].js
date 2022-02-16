import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // ...add more providers here
  ],
  database: process.env.DATABASE_URL,

  session: {
    strategy: "jwt",
  },
  secret: process.env.secret,

  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.id = token.sub;
      return session;
    },

    // redirect({ url, baseUrl }) {
    //   if (url.startsWith(baseUrl)) return url;
    //   // Allows relative callback URLs
    //   else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
    //   return baseUrl;
    // },
  },
});
