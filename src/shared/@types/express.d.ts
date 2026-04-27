import { RefreshToken } from "../../modules/auth/schema/RefreshToken.schema";

export {};

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
      };
      refreshTokenRecord?: RefreshToken;
    }
  }
}
