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

function getConfiguredUsers(): Array<{
  email: string;
  password: string;
  name: string;
}> {
  const emails = parseArrayEnvironmentVariable("AUTH_USER_EMAILS");
  const passwords = parseArrayEnvironmentVariable("AUTH_USER_PASSWORDS");
  const names = parseArrayEnvironmentVariable("AUTH_USER_NAMES");

  if (emails.length !== passwords.length) {
    throw new Error(
      "AUTH_USER_EMAILS and AUTH_USER_PASSWORDS must contain the same number of entries.",
    );
  }

  return emails.map((email, index) => ({
    email,
    password: passwords[index],
    name: names[index] ?? email,
  }));
}

function parseArrayEnvironmentVariable(name: string): string[] {
  const value = process.env[name];

  if (!value) {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`${name} must be a valid JSON array of strings.`);
  }

  if (
    !Array.isArray(parsed) ||
    parsed.some((entry) => typeof entry !== "string" || entry.length === 0)
  ) {
    throw new Error(`${name} must be a valid JSON array of strings.`);
  }

  return parsed;
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
    redirect({ url, baseUrl }) {
      const frontendUrl = process.env.FRONTEND_URL?.trim();

      if (!frontendUrl) {
        return url;
      }

      const targetUrl = new URL(url, baseUrl);
      const appOrigin = new URL(baseUrl).origin;

      if (
        targetUrl.origin === appOrigin &&
        targetUrl.pathname === "/" &&
        !targetUrl.search &&
        !targetUrl.hash
      ) {
        return new URL(frontendUrl).toString();
      }

      return url;
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
          
        const user = getConfiguredUsers().find(
          (configuredUser) =>
            isValidCredential(email, configuredUser.email) &&
            isValidCredential(password, configuredUser.password),
        );

        if (!user) {
          return null;
        }

        const token = randomBytes(32).toString("hex");

        return {
          id: email,
          email,
          name: user.name,
          token,
          permissions: createCardPermissions(token),
        };
      },
    }),
  ],
});
