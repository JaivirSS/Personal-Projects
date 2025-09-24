import { Request } from "express";
import { AuthRequest, HTTPResponse, HTTPStatus, newErrorPayload } from "../../http";
import { getUserById, getUsersByName } from "../../db/queries/user/user";
import { ReturnedUser, User } from "../../db/models/models";
interface getUsersResponse {
  users: ReturnedUser[];
}
function newGetUsersResponse(users: User[]): getUsersResponse {
  const returnedUsers = users.map((user): ReturnedUser => {
    return {
      username: user.username,
      id: user.id,
      email: user.email,
      profile_picture: user.profile_picture,
    };
  });
  return { users: returnedUsers };
}
export async function handleGetUsers(req: Request) {
  const username = req.params.username;
  if (!username) {
    return new HTTPResponse(
      newErrorPayload("no username"),
      HTTPStatus.BadRequest,
    );
  }
  try {
    const users = await getUsersByName(username);
    return new HTTPResponse(newGetUsersResponse(users), HTTPStatus.StatusOk);
  } catch (error) {
    return new HTTPResponse(
      newErrorPayload(" something went wrong"),
      HTTPStatus.BadRequest,
    );
  }
}


export async function getUser(req: Request){
  const userId = (req as AuthRequest).userId
  if (!userId){
    return new HTTPResponse(newErrorPayload("something went wrong "), HTTPStatus.BadRequest)
  }
  try {
    const user = await getUserById(userId)
    const response: ReturnedUser = {
      id: user.id,
      username: user.username,
      profile_picture: user.profile_picture,
      email: user.email
    }
    return new HTTPResponse(response, HTTPStatus.StatusOk)
  } catch (error) {
    return new HTTPResponse(newErrorPayload("something went wrong "), HTTPStatus.BadRequest)

  }
}