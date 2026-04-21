import { JwtPayload } from "../middlewares/autenticarJWT";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
