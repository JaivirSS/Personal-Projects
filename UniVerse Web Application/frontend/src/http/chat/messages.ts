import { Message } from "../../models/models";
import { AuthHandler } from "../../util/auth/auth";
import { HTTPResponse } from "../http";

export async function getMessages(roomId: number, page: number) {
  const result = await fetch(
    import.meta.env.VITE_BASE_URL +
      "/messages/" +
      roomId.toString() +
      "?page=" +
      page.toString(),
    {
      method: "GET",
      headers: { Authorization: await new AuthHandler().getAuthHeader() },
    },
  );
  if (!result.ok) {
    throw new HTTPResponse("failed to fetch messages", result.status);
  }
  const data: { messages: Message[] } = await result.json();
  return data.messages;
}
