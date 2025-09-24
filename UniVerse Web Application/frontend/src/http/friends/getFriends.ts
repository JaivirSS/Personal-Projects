import { AuthHandler } from "../../util/auth/auth";
import { HTTPResponse } from "../http";

export interface Friend {
  username: string
  profilePicture: string
}

interface getFriendsResponse {
  friends: Friend[]
}

export interface FriendRequest {
  username: string
  id: number
}

interface getRequestResponse {
  requests: FriendRequest[]
}

export interface User {
  username: string
  id: number
}

export async function fetchFriends(page: number) {
  const result = await fetch(import.meta.env.VITE_BASE_URL + "/friends?page=" + page, {
    method: "GET",
    headers: { "Content-Type": "application/json",
               "Authorization": await new AuthHandler().getAuthHeader()
              },
  });
  if (!result.ok) {
    throw new HTTPResponse("failed to fetch friends 2", result.status);
  }
  
  const data:getFriendsResponse = await result.json()
  
  return data.friends;
}

export async function fetchRequests(page:number) {
  const result = await fetch(import.meta.env.VITE_BASE_URL + "/friendRequest?page=" + page, {
    method: "GET",
    headers: { "Content-Type": "application/json",
               "Authorization": await new AuthHandler().getAuthHeader()
              },
  });
  if (!result.ok) {
    throw new HTTPResponse("failed to fetch friend requests", result.status);
  }
  
  const data:getRequestResponse = await result.json()
  
  return data.requests;
}

export async function postFriendRequest(friendId: number) {
  const result = await fetch(import.meta.env.VITE_BASE_URL + "/makeFriendRequest/" + friendId, {
    method: "POST",
    headers: { "Content-Type": "application/json",
               "Authorization": await new AuthHandler().getAuthHeader()
    },
  });
  if (!result.ok) {
    throw new HTTPResponse("failed to create friend request", result.status);
  }
}

export async function acceptFriendRequest(friendRequestId: number){
  console.log(import.meta.env.VITE_BASE_URL + "/acceptFriendRequest/" + friendRequestId)
  const result = await fetch(import.meta.env.VITE_BASE_URL + "/acceptFriendRequest/" + friendRequestId, {
    method: "PUT",
    headers: { "Content-Type": "application/json",
               "Authorization": await new AuthHandler().getAuthHeader()
    },
  });
  if (!result.ok) {
    throw new HTTPResponse("failed to accept friend request", result.status);
  }
}

export async function denyFriendRequest(friendRequestId: number){
  const result = await fetch(import.meta.env.VITE_BASE_URL + "/denyFriendRequest/" + friendRequestId, {
    method: "DELETE",
    headers: { "Content-Type": "application/json",
               "Authorization": await new AuthHandler().getAuthHeader()
    },
  });
  if (!result.ok) {
    throw new HTTPResponse("failed to deny friend request", result.status);
  }
}