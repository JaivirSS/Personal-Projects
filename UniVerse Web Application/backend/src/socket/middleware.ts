import { DefaultEventsMap, ExtendedError, Socket } from "socket.io";
import { JWT } from "../api/auth/jwt";

type middlwareNext = (err?: ExtendedError) => void;

export function socketAuthMiddleware(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: middlwareNext,
) {
  try {
    let token = socket.handshake.auth?.token;
    if (!token) {
      token = socket.handshake.headers.authorization;
      if (!token) {
        return next(new Error("No auth token provided"));
      }
    }
    let payload = JWT.verifyAccessToken(token);
    const userId = payload.userId;
    socket.data.userId = userId;
  } catch (error) {
    return next(new Error("Something went wrong with authentication"));
  }
  next();
}
