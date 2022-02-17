import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId:
        process.env.GOOGLE_ID ||
        "287956971412-l83s3sehgg4jpbuf4vda4sqc7oqual4t.apps.googleusercontent.com",
      clientSecret:
        process.env.GOOGLE_SECRET || "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",
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
