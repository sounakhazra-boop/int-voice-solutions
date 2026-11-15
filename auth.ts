import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { createCardPermissions } from "@/lib/permissions";

function isValidCredential(
  value: string,
  expected: string | undefined,
): boolean {
  if (!expected) {
    return false;
  }

  const received = Buffer.from(value);
  const configured = Buffer.from(expected);

  if (received.length !== configured.length) {
    return false;
  }

  return timingSafeEqual(received, configured);
}

function getStringClaim(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.authToken = user.token;
      }

      return token;
    },
    session({ session, token }) {
      session.user.token = getStringClaim(token.authToken);
      session.user.permissions = createCardPermissions(session.user.token);
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (
          !isValidCredential(email, process.env.AUTH_USER_EMAIL) ||
          !isValidCredential(password, process.env.AUTH_USER_PASSWORD)
        ) {
          return null;
        }

        const token = randomBytes(32).toString("hex");

        return {
          id: email,
          email,
          name: process.env.AUTH_USER_NAME ?? email,
          token,
          permissions: createCardPermissions(token),
        };
      },
    }),
  ],
});
