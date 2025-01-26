import React from "react";
import MLChatBot from "./MLChatBot";
import MLVisualization from "./MLVisualization";
import { useChat } from "./hooks/useChat";

type Props = {};

const MLChatbotPage = (props: Props) => {
  const { messages, getResponse, isTyping, aiResponse } = useChat();

  return (
    <div className="flex gap-2 h-dvh w-full">
      {/* // Details of machine learning */}
      <MLVisualization aiResponse={aiResponse} />
      {/* // chatbot */}
      <MLChatBot
        messages={messages}
        getResponse={getResponse}
        isTyping={isTyping}
      />
    </div>
  );
};

export default MLChatbotPage;
