import { createContext, useContext, useState } from "react";

export type LLMContextType = {
  messages: any[];
};
export type MessageType = {
  sender: "AI" | "user";
  message: string;
};
const LLMContext = createContext<LLMContextType | null>(null);

export const LLMContextProvider = ({ children }: { children: any }) => {
  const [messages, setMessages] = useState<any[]>([]);

  let eventSource: EventSource | null = null;
  const getLLMResponse = (question: string, context = "") => {
    try {
      eventSource = new EventSource(`${import.meta.env.VITE_NGROK_SERVER}/chat`);

      eventSource.onmessage = (event) => {
        const newMessage: MessageType = {
          sender: "AI",
          message: event.data,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      eventSource.onerror = (error) => {
        console.log("EventSource failed:", error);
        eventSource?.close();
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", message: question },
      ]);
    } catch (error) {
      console.log("Error while getting streaming response", error);
    }
  };
  return (
    <LLMContext.Provider
      value={{
        messages,
      }}
    >
      {children}
    </LLMContext.Provider>
  );
};

export const useLLMContext = () => {
  return useContext(LLMContext);
};
