export type ChatContextType = {
  state: {
    messages: Message[];
    isPendingState: boolean;
    dialogueState: string;
    buttonOptions: string[];
    dialogueStep: string;
    productSelectedToOrder: any;
    quantity: number;
    deliveryLocation: string;
  };
  handleUserMessage: (inputMessage: string) => void;
  handleUserInput: (inputOption: string) => void;
  isTyping: boolean;
  setProductOrder: (productId: number) => void;
  orderProductHandler: (userResponse: boolean) => void;
};

export type Message = {
  message: string;
  sender: "AI" | "user";
  type: "text" | "product" | "button";
};

export type chatbotStateType = {
  messages: Message[];
  isLoading: boolean;
  dialogueState: {
    currentMenu: string;
  };
};
