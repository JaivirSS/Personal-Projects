import { Request, Response } from "express";
import { HTTPResponse, HTTPStatus, newErrorPayload } from "../../../http";
import { getUsersByName } from "../../../db/queries/user/user"; // Assuming this function exists

export async function handleSearchUsers(req: Request): Promise<HTTPResponse> {
  const username = req.params.username;

  try {
    const users = await getUsersByName(username);
    const response = {
      users: users,
    };
    return new HTTPResponse(response, HTTPStatus.StatusOk);
  } catch (error) {
    console.log(error);
    return new HTTPResponse(newErrorPayload("Internal server error"), HTTPStatus.InternalServerError);
  }
}