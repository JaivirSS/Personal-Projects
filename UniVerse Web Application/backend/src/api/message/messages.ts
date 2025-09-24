import { Message } from "../../db/models/models";
import { getMessages, newMessage } from "../../db/queries/message/message";
import { getUserRoom } from "../../db/queries/message/userRoom";
import {
  AuthRequest,
  HTTPResponse,
  HTTPStatus,
  newErrorPayload,
} from "../../http";
import { Request } from "express";

interface getMessagesResponse {
  messages: messageResponse[];
}

interface messageResponse {
  id: number;
  sender_id: number;
  room_id: number;
  message: string;
  created_at: string;
}

function newGetMessageResponse(messages: Message[]): getMessagesResponse {
  const m: messageResponse[] = [];
  for (const mes of messages) {
    m.push({
      message: mes.content,
      room_id: mes.room_id,
      created_at: mes.created_at,
      sender_id: mes.sender_id,
      id: mes.id,
    });
  }
  return {
    messages: m,
  };
}

export async function handleGetMessages(req: Request) {
  try {
    const userId = (req as AuthRequest).userId;
    const roomId = parseInt(req.params.roomId);
    const pageQuery = req.query.page as string;
    let page = 0;
    if (pageQuery) {
      page = parseInt(pageQuery);
    }
    const ls = await getUserRoom({ userId: userId, roomId: roomId });
    if (ls.length == 0) {
      throw new HTTPResponse(
        newErrorPayload("invalid userRoom"),
        HTTPStatus.UnAuthorised,
      );
    }
    const messages = await getMessages({
      roomId: roomId,
      page: page,
    });
    return new HTTPResponse(
      newGetMessageResponse(messages),
      HTTPStatus.StatusOk,
    );
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPResponse) {
      return error;
    }
    return new HTTPResponse(
      newErrorPayload("failed to fetch messages"),
      HTTPStatus.BadRequest,
    );
  }
}

interface createMessageRequest {
  message: string;
  room_id: number;
}

export async function handleCreateMessage(req: Request) {
  try {
    const userId = (req as AuthRequest).userId;
    const body: createMessageRequest = req.body;
    const message = await newMessage({
      message: body.message,
      roomId: body.room_id,
      senderId: userId,
    });
    return new HTTPResponse(message, HTTPStatus.StatusOk);
  } catch (error) {
    if (error instanceof HTTPResponse) {
      return error;
    }
    return new HTTPResponse(
      newErrorPayload("failed to create message"),
      HTTPStatus.InternalServerError,
    );
  }
}
