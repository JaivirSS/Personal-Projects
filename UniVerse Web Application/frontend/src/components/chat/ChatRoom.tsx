import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Message } from "../../models/models";
import ChatBubble from "./ChatBubble";
import { userMap } from "../../pages/Chat";

type props = {
  messages: Message[];
  userId: number;
  users: userMap;
  handleSendMessage: (m: string) => void;
};

export default function ChatRoom({
  messages,
  userId,
  users,
  handleSendMessage,
}: props) {
  const [curMessage, setCurMessage] = useState("");
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setCurMessage(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleSendMessage(curMessage);
    setCurMessage("");
  }

  const messageContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageContainer.current) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-screen w-full p-2 tertiary">
      <div className="w-full h-full flex-col flex gap-2">
        <div
          className="flex flex-col min-h-0 overflow-scroll p-3 h-full w-full primary rounded"
          ref={messageContainer}
        >
          {messages.map((message, index) => {
            if (users[message.sender_id]) {
              let displayName = true;
              if (index != 0) {
                if (
                  messages[index].sender_id == messages[index - 1].sender_id
                ) {
                  displayName = false;
                }
              }
              return (
                <ChatBubble
                  displayName={displayName}
                  isUser={message.sender_id == userId}
                  message={message.message}
                  user={users[message.sender_id]}
                  key={message.id}
                />
              );
            }
          })}
        </div>
        <div className="w-full flex justify-center">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex">
              <input
                className="primary w-full h-12 sm:h-11 md:h-10 rounded p-3"
                value={curMessage}
                onChange={handleInputChange}
              />
              <button
                className="rounded-r primary border-l p-2 cursor-pointer"
                type="submit"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
