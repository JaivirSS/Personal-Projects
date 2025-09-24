import { twJoin } from "tailwind-merge";
import { User } from "../../models/models";

type props = {
  user: User;
  message: string;
  isUser: boolean;
  displayName: boolean;
};
export default function ChatBubble({
  message,
  isUser,
  user,
  displayName,
}: props) {
  return (
    <div
      className={twJoin(
        "w-full flex",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div className="flex flex-col min-w-[20%]">
        {displayName && (
          <label className={twJoin(isUser ? "text-right" : "text-left")}>
            {user.username}
          </label>
        )}
        <label className="rounded tertiary-background p-2 w-full">
          {message}
        </label>
      </div>
    </div>
  );
}
