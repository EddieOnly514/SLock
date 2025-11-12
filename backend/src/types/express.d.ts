import type { UserProfile } from "./user";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user?: UserProfile;
    }
  }
}

export {};

