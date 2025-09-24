export interface User {
  id: number;
  username: string;
  email: string;
  profile_picture?: string;
}

export interface Room {
  id: number;
  name: string;
  created_at: string;
}

export interface Message {
  id: number;
  room_id: number;
  sender_id: number;
  message: string;
  created_at: string;
}

export interface NewMessage {
  message: string;
  room: number;
}
