import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { messagesData } from "../Rulebased Chatbot/data/messageData";
import MesesageChat from "./components/MesesageChat";
import Typing from "../Rulebased Chatbot/components/Typing";

type Props = {
  messages: any[];
  getResponse: (inputMessage: string) => void;
  isTyping: boolean;
};

const MLChatBot = ({ messages, getResponse, isTyping }: Props) => {
  const [inputMessage, setInputMessage] = useState("");

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage === "") {
      return;
    }
    getResponse(inputMessage);
    setInputMessage("");
  };
  return (
    <div className=" flex-1 flex items-center justify-center bg-slate-100">
      {/* // chatbot component */}

      <div className="w-[500px] h-[90%] flex flex-col rounded-md p-1 shadow-2xl bg-white">
        <h1 className="bg-blue-500 text-white p-2 rounded-t-md">
          Machine Learning Chatbot
        </h1>

        {/* // chatbot messages list */}

        <div
          ref={messagesContainerRef}
          className="flex-1 flex flex-col gap-2 px-4 py-6 relative overflow-y-scroll "
        >
          {messages?.map((msg, index) => {
            return <MesesageChat key={index} message={msg} />;
          })}
          {isTyping && (
            <div className="relative bottom-2">
              <Typing />
            </div>
          )}
        </div>

        {/* // chat component */}

        <form
          className=" flex gap-2 items-center justify-between p-4"
          onSubmit={handleMessageSubmit}
        >
          <input
            type="text"
            placeholder="type your message here"
            className="border-1 flex-1 p-2 rounded-md outline-none text-sm"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button className="cursor-pointer" type="submit">
            <Send />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MLChatBot;
