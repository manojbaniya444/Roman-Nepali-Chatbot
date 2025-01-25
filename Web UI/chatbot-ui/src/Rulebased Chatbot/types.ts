import { menuFlow } from "./data/menuConfig";

export type ChatContextType = {
  state: {
    messages: Message[];
    isPendingState: boolean;
    dialogueState: "start" | "browse" | "order-track" | "order-product";
    buttonOptions: string[];
  };
  handleUserMessage: (inputMessage: string) => void;
};

export type Message = {
  message: string;
  sender: "AI" | "user";
};

export type chatbotStateType = {
  messages: Message[];
  isLoading: boolean;
  dialogueState: {
    currentMenu: string;
  };
};
