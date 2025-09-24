import { Token } from "../../../api/auth/jwt";
import { HTTPResponse, HTTPStatus, newErrorPayload } from "../../../http";
import { query } from "../../db";

interface getUserByIdI {
  id: string;
}
interface getUserI {
  email: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  profilePicture: string;
  biography: string;
  role: string;
  createdAt: string;
}

export async function getUserById(data: getUserByIdI): Promise<User[]> {
  // make query
  const getUserQuery = "SELECT * FROM users WHERE id=$1";
  const result = await query(getUserQuery, [data.id]);
  return result.rows;
}

export async function getUser(data: getUserI): Promise<User> {
  // make query
  const getUserQuery = "SELECT * FROM users WHERE email=$1";
  const result = await query(getUserQuery, [data.email]);
  if (result.rows.length == 0) {
    throw new HTTPResponse(
      newErrorPayload("user does not exist"),
      HTTPStatus.NotFound,
    );
  }
  return result.rows[0];
}

interface createUserI {
  email: string;
  username: string;
  passwordHash: string;
}
export async function createUser(data: createUserI) {
  // make query
  const createUserQuery =
    "INSERT INTO users(username, email, password) VALUES($1::text, $2::text, $3::text) RETURNING *";
  const result = await query(createUserQuery, [
    data.username,
    data.email,
    data.passwordHash,
  ]);
  const response: User = result.rows[0];
  return response;
}

interface storeRefreshTokenI {
  userId: number;
  token: Token;
}
export async function storeRefreshToken(params: storeRefreshTokenI) {
  const queryString =
    "INSERT INTO sessions(user_id, refresh_token) VALUES($1, $2)";
  await query(queryString, [params.userId, params.token.value]);
}
