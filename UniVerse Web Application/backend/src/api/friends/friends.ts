import { Request, Response } from "express";
import { AuthRequest, HTTPResponse, HTTPStatus, newErrorPayload } from "../../http";
import { fetchFriends, fetchFriendRequest, postFriendRequest, putFriendRequest, deleteFriendRequest } from "../../db/queries/friends/friends";
import { getUsersByName } from "../../db/queries/user/user";

interface Friend{
    username: string
    profilePicture: string
}

interface getFriendsResponse{
    friends: Friend[]
}

export interface aRequest {
  username: string
}

interface getRequestResponse {
  requests: Request[]
}

export interface User {
  username: string
  id: number
}

export async function getFriends(req: Request): Promise<HTTPResponse> {

    const userId = (req as AuthRequest).userId;

    try {
      let page = 0
      if (req.query.page){
        page = parseInt(req.query.page as string)
      }
      const friends = await fetchFriends({ userId, page });
      const response: getFriendsResponse = {
        friends: friends
      }
      return new HTTPResponse(response, HTTPStatus.StatusOk);
    } 
    catch (error) {
      console.log(error);
      return new HTTPResponse(newErrorPayload("Internal server error" ), HTTPStatus.InternalServerError);
    }
  }

  export async function getFriendRequest(req: Request): Promise<HTTPResponse> {

    const userId = (req as AuthRequest).userId;

    try {
      let page = 0
      if (req.query.page){
        page = parseInt(req.query.page as string)
      }
      const requests = await fetchFriendRequest({ userId, page });
      const response: getRequestResponse = {
        requests: requests
      }
      return new HTTPResponse(response, HTTPStatus.StatusOk);
    } 
    catch (error) {
      console.log(error);
      return new HTTPResponse(newErrorPayload("Internal server error" ), HTTPStatus.InternalServerError);
    }
  }

  export async function createFriendRequest(req: Request): Promise<HTTPResponse> {
    const userId = (req as AuthRequest).userId;
    try {
      const friendId = parseInt(req.params.friendId as string)
      await postFriendRequest({ userId, friendId });
      return new HTTPResponse({success: true}, HTTPStatus.StatusOk);
    } 
    catch (error) {
      console.log(error);
      return new HTTPResponse(newErrorPayload("Internal server error" ), HTTPStatus.InternalServerError);
    }
  }

  export async function acceptFriendRequest(req: Request): Promise<HTTPResponse> {
    console.log("Request received in the backend")
    const friendRequestId = req.params.friendRequestId as unknown as number
    try {
      await putFriendRequest({ friendRequestId });
      return new HTTPResponse({success: true}, HTTPStatus.StatusOk);
    } 
    catch (error) {
      console.log(error);
      return new HTTPResponse(newErrorPayload("Internal server error" ), HTTPStatus.InternalServerError);
    }
  }

  export async function denyFriendRequest(req: Request): Promise<HTTPResponse> {
    const friendRequestId = req.params.friendRequestId as unknown as number
    try {
      await deleteFriendRequest({ friendRequestId });
      return new HTTPResponse({success: true}, HTTPStatus.StatusOk);
    } 
    catch (error) {
      console.log(error);
      return new HTTPResponse(newErrorPayload("Internal server error" ), HTTPStatus.InternalServerError);
    }
  }
