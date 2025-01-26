import { actionTypes } from "./ChatContext";

export const chatbotReducer = (state: any, action: any) => {
  switch (action.type) {
    case actionTypes.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, { ...action.payload }],
      };
    case actionTypes.SET_PENDING:
      return {
        ...state,
        isPendingState: action.payload,
      };
    case actionTypes.SET_DIALOGUE_STATE:
      return {
        ...state,
        dialogueState: action.payload.dialogueState,
        dialogueStep: action.payload.dialogueStep,
      };

    case actionTypes.SET_ORDER:
      return {
        ...state,
        productSelectedToOrder: action.payload,
      };
    case actionTypes.SET_DELIVERY_PLACE:
      return {
        ...state,
        deliveryLocation: action.payload,
      };

    case actionTypes.SET_QUANTITY:
      return {
        ...state,
        quantity: action.payload,
      };
    case actionTypes.RESET_STATE:
      return {
        ...state,
        dialogueState: action.payload.dialogueState,
        dialogueStep: action.payload.dialogueStep,
        quantity: 0,
        productSelectedToOrder: null,
        deliveryLocation: "",
      };
    default:
      return state;
  }
};
