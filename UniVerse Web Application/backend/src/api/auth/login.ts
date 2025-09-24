import { Request } from "express";
import { HTTPResponse, HTTPStatus, newErrorPayload } from "../../http";
import {
  createUser,
  getUser,
  storeRefreshToken,
} from "../../db/queries/auth/login";
import bcrypt from "bcrypt";
import { JWT, Token } from "./jwt";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: Token;
  refreshToken: Token;
}

export async function login(req: Request) {
  // check db for the record hash password
  // if correct then create a new access and refresh token and store refresh token in the db
  const data = req.body as LoginRequest;
  if (!data.password || !data.email) {
    return new HTTPResponse(
      newErrorPayload("Password and Email required"),
      HTTPStatus.BadRequest,
    );
  }
  // fetch user form database hash password using bcrypt and compare
  try {
    const user = await getUser({ email: data.email });
    const result = await bcrypt.compare(data.password, user.password);
    if (!result) {
      return new HTTPResponse(
        newErrorPayload("Incorrect password"),
        HTTPStatus.UnAuthorised,
      );
    }
    // return new access and refresh token
    const accessToken = JWT.generateAccessToken(user.id);
    const refreshToken = JWT.generateRefreshToken(user.id);
    const response: LoginResponse = {
      refreshToken: refreshToken,
      accessToken: accessToken,
    };
    storeRefreshToken({ userId: user.id, token: refreshToken });
    return new HTTPResponse(response, HTTPStatus.StatusOk);
  } catch (error) {
    if (error instanceof HTTPResponse) {
      return error;
    }
    return new HTTPResponse(
      newErrorPayload("Something went wrong"),
      HTTPStatus.BadRequest,
    );
  }
}

interface registerRequest {
  username: string;
  password: string;
  email: string;
}
export async function register(req: Request) {
  const saltRounds = 10;
  const data = req.body as registerRequest;
  if (!data.password || !data.username || !data.email) {
    return new HTTPResponse(
      newErrorPayload("Password, Username, and Email required"),
      HTTPStatus.BadRequest,
    );
  }
  // hash password and create new user in the database
  // return new access and refresh token
  try {
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    const user = await createUser({
      username: data.username,
      passwordHash: hashedPassword,
      email: data.email,
    });
    const accessToken = JWT.generateAccessToken(user.id);
    const refreshToken = JWT.generateRefreshToken(user.id);
    const response: LoginResponse = {
      refreshToken: refreshToken,
      accessToken: accessToken,
    };
    return new HTTPResponse(response, HTTPStatus.StatusOk);
  } catch (error: any) {
    console.log(error);
    if (error.code == "23505") {
      return new HTTPResponse(
        newErrorPayload("Duplicate account"),
        HTTPStatus.Conflict,
      );
    }
    return new HTTPResponse(
      newErrorPayload("Something went wrong"),
      HTTPStatus.BadRequest,
    );
  }
}
