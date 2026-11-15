import type { DefaultSession } from "next-auth";
import type { CardPermissions } from "@/lib/permissions";

declare module "next-auth" {
  interface User {
    permissions: CardPermissions;
    token: string;
  }

  interface Session {
    user: {
      permissions: CardPermissions;
      token: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    permissions?: CardPermissions;
    authToken?: string;
  }
}
