import { Request } from "express";
import {
  AuthRequest,
  HTTPResponse,
  HTTPStatus,
  newErrorPayload,
} from "../../http";
import {
  createRoomQuery,
  deleteRoomQuery,
  getRooms,
  getUserRoom,
  getUsersFromRoom,
} from "../../db/queries/message/userRoom";
import { Room, User } from "../../db/models/models";

interface getRoomsResponse {
  rooms: Room[];
}

export async function handleGetRooms(req: Request) {
  try {
    const userId = (req as AuthRequest).userId;
    if (!userId) return new HTTPResponse("no userid", HTTPStatus.UnAuthorised);
    const rooms = await getRooms(userId);
    const response: getRoomsResponse = {
      rooms: rooms,
    };
    return new HTTPResponse(response, HTTPStatus.StatusOk);
  } catch (error) {
    console.log(error);
    return new HTTPResponse(
      newErrorPayload("something went wrong"),
      HTTPStatus.InternalServerError,
    );
  }
}

interface createRoomRequest {
  users: number[];
  name?: string;
}
interface ids {
  [key: number]: boolean;
}
function removeDuplicates(users: number[]) {
  const added: ids = {};
  const uniqueNumbers: number[] = [];
  for (const u of users) {
    if (!added[u]) {
      uniqueNumbers.push(u);
      added[u] = true;
    }
  }
  return uniqueNumbers;
}
export async function createRoom(req: Request) {
  try {
    const userId = (req as AuthRequest).userId;
    const body: createRoomRequest = req.body;
    body.users.push(userId);
    await createRoomQuery(removeDuplicates(body.users), body.name);
  } catch (error) {
    return new HTTPResponse(
      newErrorPayload("something went wrong"),
      HTTPStatus.InternalServerError,
    );
  }
  return new HTTPResponse({ message: "created room" }, HTTPStatus.StatusOk);
}

export async function deleteRoom(req: Request) {
  try {
    const userId = (req as AuthRequest).userId;
    const roomId = parseInt(req.params.roomId);
    if (!roomId) {
      return new HTTPResponse(
        newErrorPayload("invalid roomid"),
        HTTPStatus.BadRequest,
      );
    }
    const isRooms = await getUserRoom({ roomId: roomId, userId: userId });
    if (isRooms.length == 0) {
      return new HTTPResponse(
        newErrorPayload("invalid room"),
        HTTPStatus.BadRequest,
      );
    }
    await deleteRoomQuery(roomId);
    return new HTTPResponse({ message: "deleted room" }, HTTPStatus.StatusOk);
  } catch (error) {
    console.log(error);
    return new HTTPResponse(
      newErrorPayload("something went wrong"),
      HTTPStatus.BadRequest,
    );
  }
}

interface userResponse {
  id: number;
  username: string;
  email: string;
  profile_picture: string;
}

interface getUsersFromRoomIdResponse {
  users: userResponse[];
}

function newUsersResponse(users: User[]): getUsersFromRoomIdResponse {
  const usersRespone: userResponse[] = [];
  for (const user of users) {
    usersRespone.push({
      id: user.id,
      username: user.username,
      email: user.email,
      profile_picture: user.profile_picture,
    });
  }
  return { users: usersRespone };
}

export async function getUsersFromRoomId(req: Request) {
  try {
    const userId = (req as AuthRequest).userId;
    const roomId = parseInt(req.params.roomId);
    const ls = await getUserRoom({ roomId: roomId, userId: userId });
    if (ls.length == 0) {
      return new HTTPResponse(
        newErrorPayload("invalid roomid"),
        HTTPStatus.UnAuthorised,
      );
    }
    const users = await getUsersFromRoom(roomId);
    return new HTTPResponse(newUsersResponse(users), HTTPStatus.StatusOk);
  } catch (error) {
    console.log(error);
    return new HTTPResponse(
      newErrorPayload("something went wrong"),
      HTTPStatus.InternalServerError,
    );
  }
}
