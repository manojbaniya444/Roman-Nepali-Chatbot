import { useState } from "react";
import { AiResponseType, fetchAiResponse } from "../api";

type Message = {
  sender: "AI" | "user";
  message: string;
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "AI",
      message: "Namaste, ma AI assistant hajurlai kasari assist garna sakxu?",
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [aiResponse, setAIResponse] = useState<AiResponseType | null>(null);

  const addMessage = async (message: string, sender: string) => {
    if (sender === "user") {
      setMessages((prev) => [
        ...prev,
        {
          sender: sender,
          message: message,
        },
      ]);
    } else {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessages((prev) => [
        ...prev,
        {
          sender: sender as "AI",
          message: message,
        },
      ]);
      setIsTyping(false);
    }
  };

  const getResponse = async (userMessage: string) => {
    await addMessage(userMessage, "user");
    // get the ai response
    const aiResponseData: AiResponseType | undefined = await fetchAiResponse(
      userMessage
    );

    if (aiResponseData) {
      await addMessage(aiResponseData.response, "AI");
      console.log(aiResponseData)
      console.log("set ai response data")
      setAIResponse(aiResponseData);
    }
  };

  return { messages, getResponse, isTyping, aiResponse };
};
