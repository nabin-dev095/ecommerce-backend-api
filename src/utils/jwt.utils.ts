import jwt from "jsonwebtoken";
import { IJwtPayload } from "../types/jwt.interface";
import { ENV_CONFIG } from "../config/env.config";

export const generateJwtToken = (Payload: IJwtPayload) => {
  try {
    const token = jwt.sign(Payload, ENV_CONFIG.JWT_SECRET, {
      // algorithm: "ES256"
      expiresIn: ENV_CONFIG.JWT_EXPIRES_IN as any,
    });
    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, ENV_CONFIG.JWT_SECRET) as IJwtPayload;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
