declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      auth_level: "admin" | "team" | "basic";
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    auth_level: "admin" | "team" | "basic";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    auth_level?: "admin" | "team" | "basic";
  }
}
