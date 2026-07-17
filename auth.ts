import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// NextAuth v5 (Auth.js). Reads AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
// from .env.local automatically.
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
});
