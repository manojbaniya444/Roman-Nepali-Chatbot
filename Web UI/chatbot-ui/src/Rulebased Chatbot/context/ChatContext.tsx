import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { chatbotReducer } from "./ChatReducer";
import { ChatContextType } from "../types";
import { menuFlow } from "../data/menuConfig";

const initialState = {
  messages: [
    {
      sender: "AI",
      message:
        "Namaskar ma ecommerce assistant hajurlai kasto sahayog chaiyeko xa?",
    },
  ],
  buttonOptions: [
    "Browse Products",
    "Order Tracking",
    "Contact Support",
    "Order Product",
  ],
  isPendingState: false,
  dialogueState: "start"
};

export const actionTypes = {
  ADD_MESSAGE: "ADD_MESSAGE",
  SET_MENU: "SET_MENU",
  SET_ORDER_ID: "SET_ORDER_ID",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatContextProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);

  const stateChat =
    menuFlow[state.dialogueState.currentMenu as keyof typeof menuFlow];

  const handleUserMessage = (inputMessage: string) => {
    dispatch({
      type: actionTypes.ADD_MESSAGE,
      payload: { sender: "user", message: inputMessage },
    });
  };
  return (
    <ChatContext.Provider value={{ state, handleUserMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
