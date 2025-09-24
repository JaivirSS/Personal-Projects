import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { HTTPResponse, HTTPStatus, newErrorPayload } from "../../http";
dotenv.config();

const accessSecret = process.env.ACCESS_SECRET!;
const refreshSecret = process.env.REFRESH_SECRET!;

interface JWTPayload {
  userId: number;
}

export interface Token {
  value: string;
  expiresAt: Date;
}

export class JWT {
  public static generateAccessToken(userId: number): Token {
    const payload: JWTPayload = {
      userId: userId,
    };
    const expiresIn = 15 * 60 * 1000; //15minutes

    return {
      value: jwt.sign(payload, accessSecret, { expiresIn: expiresIn / 1000 }),
      expiresAt: new Date(new Date().getTime() + expiresIn),
    };
  }

  public static generateRefreshToken(userId: number): Token {
    const payload: JWTPayload = {
      userId: userId,
    };
    const expiresIn = 12 * 30 * 24 * 60 * 60 * 1000; //12months
    return {
      value: jwt.sign(payload, refreshSecret, {
        expiresIn: expiresIn / 1000,
      }),
      expiresAt: new Date(new Date().getTime() + expiresIn),
    };
  }

  public static verifyAccessToken(token: string) {
    try {
      const p = jwt.verify(token, accessSecret, {}) as JWTPayload;
      return p;
    } catch (error) {
      throw new HTTPResponse(
        newErrorPayload("Invalid token"),
        HTTPStatus.BadRequest,
      );
    }
  }

  public static verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, refreshSecret, {}) as JWTPayload;
    } catch (error) {
      throw new HTTPResponse(
        newErrorPayload("Invalid token"),
        HTTPStatus.BadRequest,
      );
    }
  }
}
