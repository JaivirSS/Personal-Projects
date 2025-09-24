export interface UserRoom {
  id: number;
  user_id: number;
  room_id: number;
}
export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  image: string;
  created_at: string;
}

export interface Message {
  id: number;
  sender_id: number;
  room_id: number;
  content: string;
  created_at: string;
}

export interface Room {
  id: number;
  name: string;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  profile_picture: string;
  biography: string;
  role: string;
  created_at: string;
}

export interface ReturnedUser {
  id: number;
  email: string;
  username: string;
  profile_picture: string;
}
