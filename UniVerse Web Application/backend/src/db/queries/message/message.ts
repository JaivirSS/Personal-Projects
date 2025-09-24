import { HTTPResponse, HTTPStatus, newErrorPayload } from "../../../http";
import { query } from "../../db";
import { Message } from "../../models/models";

interface newMessageQuery {
  senderId: number;
  roomId: number;
  message: string;
}
interface getMessagesQuery {
  roomId: number;
  page: number;
}

export async function newMessage(params: newMessageQuery) {
  const queryString =
    "INSERT INTO messages(sender_id, room_id, content) VALUES($1,$2,$3) RETURNING *";
  const result = await query(queryString, [
    params.senderId,
    params.roomId,
    params.message,
  ]);
  if (result.rows.length == 0) {
    throw new HTTPResponse(
      newErrorPayload("something went wrong when creating message"),
      HTTPStatus.InternalServerError,
    );
  }
  const message: Message = result.rows[0];
  return message;
}

export async function getMessages(params: getMessagesQuery) {
  if (params.page < 0) {
    params.page = 0;
  } else if (!params.page) {
    params.page = 0;
  }
  const queryString =
    "SELECT * FROM messages WHERE room_id=$1 ORDER BY created_at DESC LIMIT 10 OFFSET $2";
  const result = await query(queryString, [params.roomId, params.page * 10]);
  const rows: Message[] = result.rows;
  return rows;
}
