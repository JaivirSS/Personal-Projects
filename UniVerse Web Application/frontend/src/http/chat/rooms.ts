import { Room, User } from "../../models/models";
import { AuthHandler } from "../../util/auth/auth";
import { HTTPResponse } from "../http";

interface getRoomsResponse {
  rooms: Room[];
}
export async function getRooms() {
  const response = await fetch(import.meta.env.VITE_BASE_URL + "/rooms", {
    method: "GET",
    headers: { Authorization: await new AuthHandler().getAuthHeader() },
  });
  if (!response.ok) {
    throw new HTTPResponse("failed to fetch rooms", response.status);
  }
  const data: getRoomsResponse = await response.json();
  return data.rooms;
}

interface createRoomRequest {
  users: number[];
  name?: string;
}
export async function createRoom(req: createRoomRequest) {
  const response = await fetch(import.meta.env.VITE_BASE_URL + "/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: await new AuthHandler().getAuthHeader(),
    },
    body: JSON.stringify({ users: req.users, name: req.name }),
  });
  if (!response.ok) {
    throw new HTTPResponse("failed to create room", response.status);
  }
}
export async function deleteRoom(roomId: number) {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + "/rooms/" + roomId.toString(),
    {
      method: "DELETE",
      headers: {
        Authorization: await new AuthHandler().getAuthHeader(),
      },
    },
  );
  if (!response.ok) {
    throw new HTTPResponse("failed to delete room", response.status);
  }
}

interface leaveRoomRequest {
  room_id: number;
}
export async function leaveRoom(req: leaveRoomRequest) {
  const response = await fetch(import.meta.env.VITE_BASE_URL + "/rooms", {
    method: "DELETE",
    headers: { Authorization: await new AuthHandler().getAuthHeader() },
    body: JSON.stringify(req),
  });
  if (!response.ok) {
    throw new HTTPResponse("failed to leave room", response.status);
  }
}

interface getUsersFromRoomIdResponse {
  users: User[];
}

export async function getUsersFromRoomId(roomId: number) {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + "/rooms/users/" + roomId.toString(),
    {
      method: "GET",
      headers: { Authorization: await new AuthHandler().getAuthHeader() },
    },
  );
  if (!response.ok) {
    throw new HTTPResponse("failed to fetch users from room", response.status);
  }
  const data: getUsersFromRoomIdResponse = await response.json();
  return data.users;
}
