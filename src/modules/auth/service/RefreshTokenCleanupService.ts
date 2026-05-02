import { LessThan } from "typeorm";
import { AppDataSource } from "../../../shared/database/data-source";
import { RefreshToken } from "../schema/RefreshToken.schema";

export class RefreshTokenCleanupService {
  private static intervalId: NodeJS.Timeout | null = null;

  static start(intervalMinutes: number = 60) {
    const cleanedIntervalMinutes = Number(intervalMinutes) || 60;
    const intervalMs = Math.max(cleanedIntervalMinutes, 1) * 60 * 1000;

    this.cleanup();
    this.intervalId = setInterval(() => this.cleanup(), intervalMs);
    console.log(
      `[RefreshTokenCleanup] running every ${cleanedIntervalMinutes} minute(s)`,
    );
  }

  static async cleanup() {
    if (!AppDataSource.isInitialized) {
      return;
    }

    try {
      const repo = AppDataSource.getRepository(RefreshToken);
      const result = await repo.delete({ expiresAt: LessThan(new Date()) });
      console.log(
        `[RefreshTokenCleanup] deleted ${result.affected ?? 0} expired refresh token(s)`,
      );
    } catch (error) {
      console.error("[RefreshTokenCleanup] cleanup failed:", error);
    }
  }

  static stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
