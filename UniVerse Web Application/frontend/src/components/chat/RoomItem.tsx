import { twJoin } from "tailwind-merge";
import { RoomData } from "./Rooms";
import { DeleteOutline } from "@mui/icons-material";

type props = {
  room: RoomData;
  isSelected: boolean;
  handleChangeRoom: (roomId: number) => void;
  handleDeleteRoom: (roomId: number) => void;
};

export default function RoomItem({
  room,
  handleChangeRoom,
  isSelected,
  handleDeleteRoom,
}: props) {
  return (
    <button
      className={twJoin(
        "p-2 rounded hover:cursor-pointer",
        isSelected ? "secondary" : "tertiary",
      )}
      onClick={() => handleChangeRoom(room.id)}
    >
      <div className="flex gap-2 hover:cursor-pointer">
        <label className="hover: cursor-pointer">{room.name}</label>
        <DeleteOutline
          className="ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteRoom(room.id);
          }}
        />
      </div>
    </button>
  );
}
