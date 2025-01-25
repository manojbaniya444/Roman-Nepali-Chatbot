import { Ban, MessageSquareX, SendHorizontal } from "lucide-react";
import React, { useState } from "react";
import { useChatContext } from "./context/ChatContext";
import ChatMessage from "./components/ChatMessage";
import { ChatContextType } from "./types";

type Props = {
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatBot = ({ setShowChat }: Props) => {
  const { state, handleUserMessage } = useChatContext() as ChatContextType;
  const [inputMessage, setInputMessage] = useState("");

  const { messages, isPendingState, buttonOptions } = state;

  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    inputMessage && handleUserMessage(inputMessage);
    setInputMessage("");
  };

  const handleMenuState = (option: string) => {};

  console.log(messages);
  return (
    <div className="fixed bottom-4 right-2 h-[550px] w-[400px] bg-white rounded-lg shadow-xl flex flex-col">
      {/* // chat header */}
      <div className="flex justify-between p-2 bg-gray-200 text-black rounded-t-lg">
        <h1>Chatbot</h1>
        <div onClick={() => setShowChat(false)} className="cursor-pointer">
          <MessageSquareX />
        </div>
      </div>
      {/* // messages */}
      <div className="flex flex-col gap-2 p-2 flex-1">
        {messages?.map((message, index) => {
          return <ChatMessage key={index} message={message} />;
        })}
        <div className="self-center flex flex-col gap-2 mt-5">
          {!isPendingState &&
            buttonOptions.map((optn, index) => {
              return (
                <button
                  key={index}
                  className="bg-cyan-600 rounded-lg cursor-pointer text-white  px-4 py-2"
                  onClick={() => handleMenuState(optn)}
                >
                  {optn}
                </button>
              );
            })}
        </div>
      </div>
      {/* // send message component */}
      <form
        onSubmit={handleMessageSubmit}
        className="flex justify-between bg-slate-100 p-3 gap-2"
      >
        <input
          type="text"
          placeholder="type your message"
          className="text-black w-full border-gray-500 border-[1px] p-1 rounded-xs outline-none text-xs"
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
        />
        <button
          className="cursor-pointer"
          type="submit"
          disabled={!isPendingState}
        >
          {isPendingState ? <SendHorizontal /> : <Ban />}
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
