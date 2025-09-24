import { useEffect, useRef, useState } from "react";
import Rooms, { RoomData } from "../components/chat/Rooms";
import {
  createRoom,
  deleteRoom,
  getRooms,
  getUsersFromRoomId,
} from "../http/chat/rooms";
import ChatRoom from "../components/chat/ChatRoom";
import { io, Socket } from "socket.io-client";
import { AuthHandler, Token } from "../util/auth/auth";
import { Message, NewMessage, User } from "../models/models";
import { getMessages } from "../http/chat/messages";
import { useRouteLoaderData, useSearchParams } from "react-router";

interface receivedMessage {
  id: number;
  room_id: number;
  sender_id: number;
  message: string;
  created_at: string;
}

export interface userMap {
  [key: number]: User;
}

function newUserMap(users: User[]) {
  const map: userMap = {};
  for (const user of users) {
    map[user.id] = user;
  }
  return map;
}

export default function Chat() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [users, setUsers] = useState<userMap>([]);
  const [page, _] = useState<number>(0);
  const [curRoomId, setCurRoomId] = useState<number | undefined>();
  const curRoomIdRef = useRef<number | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const accessToken: Token | undefined = useRouteLoaderData("root");
  const [userId, setUserId] = useState<number | undefined>();
  const [socket, setSocket] = useState<Socket>(
    io(import.meta.env.VITE_BASE_URL, {
      auth: { token: new AuthHandler().getAccessToken().value },
      autoConnect: false,
    }),
  );

  const [searchParams, _setSearchParams] = useSearchParams();

  // useEffect(() => {
  //   for (const r of rooms) {
  //     if (r.id == curRoomId) {
  //       return;
  //     }
  //   }
  //   console.log("undefine");
  //   setCurRoomId(undefined);
  // }, [rooms]);
  //

  useEffect(() => {
    async function fetch() {
      try {
        const targetUserId = searchParams.get("user_id");
        if (!targetUserId) {
          return;
        }
        await handleCreateRoom(parseInt(targetUserId));
        const fetchedRooms = await getRooms();
        setRooms(fetchedRooms);
        handleSelectRoom(fetchedRooms[fetchedRooms.length - 1].id);
      } catch (error) {
        console.log(error);
        alert("failed to create room");
      }
    }
    fetch();
  }, []);

  useEffect(() => {
    if (!accessToken) {
      console.log("Unexptected: not logged in");
      return;
    }
    try {
      const uid = AuthHandler.decodeAccessToken(accessToken);
      setUserId(uid);
    } catch (error) {
      console.log("unable to decode access token");
    }
  }, []);

  function handleSelectRoom(roomId: number) {
    setCurRoomId(roomId);
    curRoomIdRef.current = roomId;
  }

  async function handleAddRoom(users: User[], name?: string) {
    try {
      await createRoom({
        name: name,
        users: users.map((u) => {
          return u.id;
        }),
      });
      await refetchRooms();
    } catch (error) {
      alert("faild to create room");
    }
  }

  async function handleCreateRoom(user: number) {
    try {
      await createRoom({
        users: [user],
      });
      await refetchRooms();
    } catch (error) {
      alert("faild to create room");
    }
  }

  useEffect(() => {
    if (!curRoomId) {
      setMessages([]);
      return;
    }
    async function startFetch() {
      if (!curRoomId) {
        return;
      }
      try {
        const fetchedMessages = (await getMessages(curRoomId, page)).reverse();
        setMessages(fetchedMessages);
        const fetchedUsers = await getUsersFromRoomId(curRoomId);
        setUsers(newUserMap(fetchedUsers));
        socket.emit("joinRoom", JSON.stringify({ room: curRoomId }));
      } catch (error) {
        console.log(error);
      }
    }
    startFetch();
  }, [curRoomId]);

  useEffect(() => {
    async function fetch() {
      const fetchedRooms = await getRooms();
      setRooms(fetchedRooms);
    }
    fetch();
  }, []);

  async function refetchRooms() {
    try {
      const fetchedRooms = await getRooms();
      setRooms(fetchedRooms);
    } catch (error) {
      alert("failed to fetch rooms");
    }
  }

  async function handleDeleteRoom(roomId: number) {
    try {
      await deleteRoom(roomId);
      await refetchRooms();
    } catch (error) {
      alert("failed to delete room");
    }
  }

  function handleSendMessage(curMessage: string) {
    if (!curMessage || !curRoomId) {
      return;
    }
    try {
      const newMessage: NewMessage = {
        message: curMessage,
        room: curRoomId,
      };
      socket.emitWithAck("message", JSON.stringify(newMessage));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BASE_URL, {
      auth: { token: new AuthHandler().getAccessToken().value },
      autoConnect: false,
    });

    newSocket.on("message", (data: receivedMessage) => {
      try {
        const newMessage: Message = {
          id: data.id,
          room_id: data.room_id,
          message: data.message,
          sender_id: data.sender_id,
          created_at: data.created_at,
        };
        if (newMessage.room_id == curRoomIdRef.current) {
          setMessages((prev) => {
            for (const m of prev) {
              if (newMessage.id == m.id) {
                return prev;
              }
            }
            return [...prev, newMessage];
          });
        }
      } catch (error) {
        console.log(error);
        alert("something went wrong when receiving message");
      }
    });
    newSocket.on("connect", async () => {
      console.log("connect");
    });
    newSocket.connect();
    () => {
      newSocket.off("message");
      newSocket.off("connect");
      newSocket.disconnect();
    };
    setSocket(newSocket);
  }, []);

  return (
    <div className="flex h-screen w-screen tertiary">
      <Rooms
        rooms={rooms}
        curRoomId={curRoomId}
        handleChangeRoom={handleSelectRoom}
        handleAddRoom={handleAddRoom}
        handleDeleteRoom={handleDeleteRoom}
      />
      {curRoomId !== undefined && userId !== undefined && (
        <ChatRoom
          users={users}
          messages={messages}
          userId={userId}
          handleSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}
