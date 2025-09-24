import { HTTPResponse, HTTPStatus, newErrorPayload } from "../../../http";
import { query } from "../../db";
import { Room, User, UserRoom } from "../../models/models";
import { getUsersById } from "../user/user";

interface getUserRoomParams {
  userId: number;
  roomId: number;
}

export async function getUserRoom(params: getUserRoomParams) {
  const queryString =
    "SELECT * FROM user_rooms WHERE user_id = $1 AND room_id = $2";
  const result = await query(queryString, [params.userId, params.roomId]);
  const rows: UserRoom[] = result.rows;
  return rows;
}

export async function getUsersFromRoom(roomId: number) {
  const queryString =
    "SELECT * FROM user_rooms JOIN users ON users.id = user_rooms.user_id WHERE room_id = $1";
  const result = await query(queryString, [roomId]);
  const rows: User[] = result.rows;
  return rows;
}

export async function getRooms(userId: number) {
  const queryString =
    "SELECT rooms.id, user_id, name, created_at FROM user_rooms JOIN rooms ON room_id = rooms.id WHERE user_id = $1";
  const result = await query(queryString, [userId]);
  const rows: Room[] = result.rows;
  return rows;
}

export async function deleteRoomQuery(roomId: number) {
  const queryString = "DELETE FROM rooms WHERE id=$1;";
  await query(queryString, [roomId]);
}

export async function createRoomQuery(userIds: number[], name?: string) {
  let roomName = name;
  if (!name) {
    roomName = "";
    const users = await getUsersById(userIds);
    for (let i = 0; i < Math.min(3, users.length); i++) {
      const user = users[i];
      if (i == Math.min(3, users.length) - 1) {
        roomName += user.username;
      } else {
        roomName += user.username + ", ";
      }
    }
  }
  const queryString = "INSERT INTO rooms(name) VALUES($1) RETURNING *";
  const result = await query(queryString, [roomName]);
  if (result.rows.length == 0) {
    throw new HTTPResponse(
      newErrorPayload("failed to create new room"),
      HTTPStatus.InternalServerError,
    );
  }
  const room: Room = result.rows[0];
  for (const id of userIds) {
    await addUserToRoom(room.id, id);
  }
}

export async function addUserToRoom(roomId: number, userId: number) {
  const queryString = "INSERT INTO user_rooms(user_id, room_id) VALUES($1,$2)";
  await query(queryString, [userId, roomId]);
}
