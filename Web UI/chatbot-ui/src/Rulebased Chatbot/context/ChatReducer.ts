import { actionTypes } from "./ChatContext";

export const chatbotReducer = (state: any, action: any) => {
  switch (action.type) {
    case actionTypes.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, { ...action.payload }],
      };
  }
};
