import { Ban, MessageSquareX, SendHorizontal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useChatContext } from "./context/ChatContext";
import ChatMessage from "./components/ChatMessage";
import { ChatContextType } from "./types";
import Typing from "./components/Typing";

type Props = {
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatBot = ({ setShowChat }: Props) => {
  const { state, handleUserMessage, handleUserInput, isTyping } =
    useChatContext() as ChatContextType;
  const [inputMessage, setInputMessage] = useState("");

  const { messages, isPendingState, buttonOptions } = state;

  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    inputMessage && handleUserMessage(inputMessage);
    setInputMessage("");
  };

  const handleMenuState = (option: string) => {
    handleUserInput(option);
  };

  // scroll the chat on new messages
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [state.messages]);

  console.log(messages);
  return (
    <div className="fixed bottom-4 right-2 h-[550px] w-[400px] md:w-[500px] md:h-[600px] bg-white rounded-lg shadow-2xl flex flex-col">
      {/* // chat header */}
      <div className="flex justify-between p-2 bg-gray-200 text-black rounded-t-lg">
        <h1>Chatbot</h1>
        <div onClick={() => setShowChat(false)} className="cursor-pointer">
          <MessageSquareX />
        </div>
      </div>
      {/* // messages */}
      <div
        className="relative flex flex-col gap-2 px-4 flex-1 scroll-auto overflow-y-auto"
        ref={chatContainerRef}
      >
        {messages?.map((message, index) => {
          return <ChatMessage key={index} message={message} />;
        })}
        <div className="relative self-center flex gap-2 mt-2 bottom-1">
          {!isPendingState &&
            buttonOptions.map((optn, index) => {
              return (
                <button
                  key={index}
                  className="rounded-lg cursor-pointer text-black border-1 hover:bg-slate-100  px-2 py-2 text-[10px]"
                  onClick={() => handleMenuState(optn)}
                >
                  {optn}
                </button>
              );
            })}
        </div>
        <div className="relative bottom-2">{isTyping && <Typing />}</div>
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
          disabled={!isPendingState || isTyping}
        >
          {isPendingState ? <SendHorizontal /> : <Ban />}
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
