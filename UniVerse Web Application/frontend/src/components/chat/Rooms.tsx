import { Modal, TextField } from "@mui/material";
import RoomItem from "./RoomItem";
import AddIcon from "@mui/icons-material/Add";
import { FormEvent, useState } from "react";
import UserSelect from "./UserSelect";
import { User } from "../../models/models";
import AnimatedButton from "../AnimatedButton";

export interface RoomData {
  id: number;
  name: string;
  created_at: string;
}

type Props = {
  rooms: RoomData[];
  curRoomId?: number;
  handleChangeRoom: (roomId: number) => void;
  handleAddRoom: (users: User[], name?: string) => Promise<void>;
  handleDeleteRoom: (roomId: number) => Promise<void>;
};

export default function Rooms({
  rooms,
  handleChangeRoom,
  curRoomId,
  handleDeleteRoom,
  handleAddRoom,
}: Props) {
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  function handleOpenRoomModal() {
    setIsRoomModalOpen(true);
  }

  function handleCloseRoomModal() {
    setIsRoomModalOpen(false);
    setRoomName("");
    setUsers([]);
  }

  async function handleSubmitCreateRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await handleAddRoom(users, roomName);
      handleCloseRoomModal();
    } catch (error) {
      alert("Failed to create room");
    }
  }

  return (
    <div className="w-64 h-screen bg-gray-800 text-white left-0 top-0 flex flex-col pt-4">
      {/* Sidebar Header */}
      <div className="px-4 pb-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Rooms</h2>
        <button
          onClick={handleOpenRoomModal}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <AddIcon className="text-white" />
        </button>
      </div>

      {/* Room List */}
      <div className="flex flex-col gap-2 overflow-y-auto p-2">
        {rooms.map((room) => (
          <RoomItem
            key={room.id}
            room={room}
            handleChangeRoom={handleChangeRoom}
            isSelected={curRoomId === room.id}
            handleDeleteRoom={handleDeleteRoom}
          />
        ))}
      </div>

      {/* Create Room Modal */}
      <Modal
        open={isRoomModalOpen}
        onClose={handleCloseRoomModal}
        className="flex justify-center items-center"
      >
        <form
          onSubmit={handleSubmitCreateRoom}
          className="bg-gray-700 p-6 rounded-lg w-96"
        >
          <div className="flex flex-col gap-4">
            <TextField
              label="Room Name"
              variant="outlined"
              fullWidth
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              InputProps={{
                style: { color: "white" },
              }}
              InputLabelProps={{
                style: { color: "white" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
              }}
            />
            <UserSelect value={users} setValue={setUsers} />
            <AnimatedButton type="submit">Create Room</AnimatedButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}

