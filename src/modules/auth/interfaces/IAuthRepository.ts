import { RefreshToken } from "../schema/RefreshToken.schema";
import { User } from "../../user/schema/User.schema";

export interface IAuthRepository {
  create(userId: string, expiresInDays: number): Promise<{ refreshToken: RefreshToken; token: string }>;
  findByToken(tokenHash: string): Promise<RefreshToken | null>;
  revokeByUserId(userId: string): Promise<void>;
  revoke(tokenHash: string): Promise<void>;
}
