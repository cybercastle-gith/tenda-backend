import { RefreshToken } from "../schema/RefreshToken.schema";
import { User } from "../../user/schema/User.schema";

export interface IAuthRepository {
  create(userId: string, expiresInDays: number): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  revokeByUserId(userId: string): Promise<void>;
  revoke(token: string): Promise<void>;
}
