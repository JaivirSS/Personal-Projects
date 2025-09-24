import { query } from "../../db";

interface FetchFriends {
  userId: number;
  page: number;
}

interface FetchRequest {
  userId: number;
  page: number;
}

interface PostRequest {
  userId: number
  friendId: number
}

interface updateFriendRequest{
  friendRequestId: number
}

export async function fetchFriends(data: FetchFriends) {
  const result = await query("SELECT u.username, u.profile_picture FROM friends f JOIN users u ON u.id = f.user_id WHERE f.friend_id = $1 AND f.is_accepted = true UNION SELECT u.username, u.profile_picture FROM friends f JOIN users u ON u.id = f.friend_id WHERE f.user_id = $1 AND f.is_accepted = true LIMIT 10 OFFSET $2", [data.userId, data.page * 10]);

  return result.rows;
}

export async function fetchFriendRequest(data: FetchRequest) {
  const result = await query("SELECT u.username, f.id FROM friends f JOIN users u ON u.id = f.user_id WHERE f.friend_id = $1 AND f.is_accepted = false LIMIT 10 OFFSET $2", [data.userId, data.page * 10]);

  return result.rows;
}

export async function postFriendRequest(data: PostRequest) {
  await query("INSERT INTO friends (user_id, friend_id, is_accepted) VALUES ($1, $2, false)", [data.userId, data.friendId])
}

export async function putFriendRequest(data: updateFriendRequest) {
  console.log("test")
  await query("UPDATE friends SET is_accepted = true WHERE id = $1", [data.friendRequestId])
}

export async function deleteFriendRequest(data: updateFriendRequest) {
  await query("DELETE FROM friends WHERE id = $1", [data.friendRequestId])
}