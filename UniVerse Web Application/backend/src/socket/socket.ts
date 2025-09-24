import { Server } from "socket.io";
import { getUserRoom } from "../db/queries/message/userRoom";
import { SocketError } from "./error";
import http from "http";
import { newMessage } from "../db/queries/message/message";
import { socketAuthMiddleware } from "./middleware";

interface joinRoomRequest {
  room: number;
}

interface sendMessageRequest {
  message: string;
  room: number;
}

interface socketResponse {
  data: any;
  error: boolean;
}

interface MessageRequest {
  id: number;
  room_id: number;
  sender_id: number;
  message: string;
  created_at: string;
}

function newCallbackResponse(data: any, error: boolean) {
  return {
    error: error,
    data: data,
  } as socketResponse;
}
export function setupSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins for simplicity, configure in production
    },
  });
  io.use(socketAuthMiddleware);
  io.on("connection", (socket) => {
    socket.on("joinRoom", async (rawBody: string, callback) => {
      try {
        const body: joinRoomRequest = JSON.parse(rawBody);
        const userId = socket.data.userId;
        if (!userId) {
          throw new SocketError("no userid");
        }
        await authenticateUserRoom(body.room, userId);
        socket.join(body.room.toString());
        if (typeof callback == "function") {
          callback(newCallbackResponse("joined room", false));
        }
      } catch (error) {
        console.log(error);
        if (typeof callback == "function") {
          callback(newCallbackResponse("something went wrong", true));
        }
      }
    });

    socket.on("message", async (rawBody: string, callback) => {
      try {
        const body: sendMessageRequest = JSON.parse(rawBody);
        const userId = socket.data.userId;
        if (!userId) {
          throw new SocketError("no userid");
        }
        const returnedMessage = await newMessage({
          senderId: userId,
          roomId: body.room,
          message: body.message,
        });
        const message: MessageRequest = {
          id: returnedMessage.id,
          room_id: returnedMessage.room_id,
          sender_id: returnedMessage.sender_id,
          message: returnedMessage.content,
          created_at: returnedMessage.created_at,
        };
        io.to(body.room.toString()).emit("message", message);
        if (typeof callback == "function") {
          callback(newCallbackResponse("sent message", false));
        }
      } catch (error) {
        if (typeof callback == "function") {
          callback(newCallbackResponse("failed to send message", true));
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnect");
    });
  });
}

async function authenticateUserRoom(roomId: number, userId: number) {
  try {
    const userRoom = await getUserRoom({
      userId: userId,
      roomId: roomId,
    });
    if (userRoom.length == 0) {
      throw new SocketError("invalid room");
    }
  } catch (error) {
    throw new SocketError(
      "something went wrong when authenticating user for room",
    );
  }
}
