import { HTTPResponse, HTTPStatus, newErrorPayload } from "../../../http";
import { query } from "../../db";
import { User } from "../../models/models";

export async function getUserById(id: number) {
  const queryString = "SELECT * FROM users WHERE id = $1";
  const result = await query(queryString, [id]);
  if (result.rows.length == 0) {
    throw new HTTPResponse(
      newErrorPayload("no user by id: " + id.toString()),
      HTTPStatus.BadRequest,
    );
  }
  const user: User = result.rows[0];
  return user;
}
export async function getUsersById(id: number[]) {
  const queryString = "SELECT * FROM users WHERE id = ANY($1)";
  const result = await query(queryString, [id]);
  if (result.rows.length == 0) {
    throw new HTTPResponse(
      newErrorPayload("no user by id: " + id.toString()),
      HTTPStatus.BadRequest,
    );
  }
  const user: User[] = result.rows;
  return user;
}

export async function getUsersByName(username: string) {
  const queryString =
    "SELECT * FROM users WHERE username ILIKE '%' || $1 || '%' OR email ILIKE '%' || $1 || '%' ORDER BY username LIMIT 5";
  const result = await query(queryString, [username]);
  const users: User[] = result.rows;
  return users;
}
