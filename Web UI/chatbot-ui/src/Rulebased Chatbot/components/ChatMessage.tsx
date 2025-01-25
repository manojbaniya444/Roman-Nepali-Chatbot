type Message = {
  message: string;
  sender: "AI" | "user";
};

const ChatMessage = ({ message }: { message: Message }) => {
  return (
    <div
      className={`${
        message.sender === "AI"
          ? "bg-blue-500 self-start text-white"
          : "self-end bg-slate-100 text-black"
      } p-1 rounded-md max-w-[70%] text-sm`}
    >
      <p>{message.message}</p>
    </div>
  );
};

export default ChatMessage;
