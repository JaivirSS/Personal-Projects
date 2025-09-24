import { User } from "../../models/models";
import { AuthHandler } from "../../util/auth/auth";
import { HTTPResponse } from "../http";

interface getUsersResponse {
  users: User[];
}

export async function getUsers(username: string) {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + "/users/" + username,
    {
      method: "GET",
      headers: { Authorization: await new AuthHandler().getAuthHeader() },
    },
  );
  if (!response.ok) {
    throw new HTTPResponse("failed to fetch users", response.status);
  }
  const data: getUsersResponse = await response.json();
  return data.users;
}


export async function getUser() {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + "/user/" ,
    {
      method: "GET",
      headers: { Authorization: await new AuthHandler().getAuthHeader() },
    },
  );
  if (!response.ok) {
    throw new HTTPResponse("failed to fetch users", response.status);
  }
  const data: User = await response.json();
  return data;
}
