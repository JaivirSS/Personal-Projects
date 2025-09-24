import { Request, Response, NextFunction } from "express";
import {
  AuthRequest,
  HTTPResponse,
  HTTPStatus,
  newErrorPayload,
} from "../../http";
import { JWT, Token } from "./jwt";
// need middleware to get the token verify it get the userId from it and append to req obj

function getToken(authHeader?: string) {
  const fullToken = authHeader;
  if (!fullToken) {
    throw new HTTPResponse(
      newErrorPayload("No token in header"),
      HTTPStatus.BadRequest,
    );
  }
  if (fullToken.split(" ")[0] != "Bearer") {
    throw new HTTPResponse(
      newErrorPayload("Need token of type Bearer"),
      HTTPStatus.BadRequest,
    );
  }
  const token = fullToken.split(" ")[1];
  if (!token) {
    throw new HTTPResponse(
      newErrorPayload("Need token"),
      HTTPStatus.BadRequest,
    );
  }
  return token;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = getToken(req.headers.authorization);
    let payload = JWT.verifyAccessToken(token);
    const userId = payload.userId;
    (req as AuthRequest).userId = userId;
  } catch (error) {
    res.status(HTTPStatus.BadRequest).json(newErrorPayload("Invalid token"));
    return;
  }
  next();
}

interface RefreshAccessTokenBody {
  token: string;
}

interface RefreshAccessTokenResponse {
  token: Token;
}

export function refreshAccessToken(req: Request) {
  const body = req.body as RefreshAccessTokenBody;
  try {
    const payload = JWT.verifyRefreshToken(body.token);
    const accessToken = JWT.generateAccessToken(payload.userId);
    const response: RefreshAccessTokenResponse = {
      token: accessToken,
    };
    return new HTTPResponse(response, HTTPStatus.StatusOk);
  } catch (error) {
    if (error instanceof HTTPResponse) {
      return error;
    }
    return new HTTPResponse(
      newErrorPayload("Invalid refresh token"),
      HTTPStatus.BadRequest,
    );
  }
}
