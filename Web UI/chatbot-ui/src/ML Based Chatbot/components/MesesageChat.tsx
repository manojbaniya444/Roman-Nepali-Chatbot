import React from "react";

type Props = {
  message: {
    sender: "AI" | "user";
    message: string;
  };
};

const MesesageChat = ({ message }: Props) => {
  return (
    <div
      className={`${message.sender === "AI" ? "bg-slate-100 self-start" : "bg-blue-500 text-white self-end"} width-[70%] p-2 rounded-md text-sm`}
    >
    <p style={{ whiteSpace: "pre-wrap" }}>{message.message}</p>
    </div>
  );
};

export default MesesageChat;
