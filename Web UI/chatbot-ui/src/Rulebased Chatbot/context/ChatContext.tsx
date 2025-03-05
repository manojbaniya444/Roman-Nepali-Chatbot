import { createContext, useContext, useReducer, useState } from "react";
import { chatbotReducer } from "./ChatReducer";
import { ChatContextType } from "../types";
import { productsList } from "../data/productsData";

const initialState = {
  messages: [
    {
      sender: "AI",
      message:
        "Namaskar ma ecommerce assistant hajurlai kasto sahayog chaiyeko xa?",
      type: "text",
    },
  ],
  buttonOptions: [
    "Browse Products",
    "Order Tracking",
    // "Contact Support",
    "Order Product",
  ],
  isPendingState: false,
  dialogueState: "start",
  dialogueStep: "",
  productSelectedToOrder: null,
  quantity: 0,
  deliveryLocation: "",
};

export const actionTypes = {
  ADD_MESSAGE: "ADD_MESSAGE",
  SET_ORDER: "ORDER_ID",
  SET_PENDING: "SET_PENDING",
  SET_DIALOGUE_STATE: "SET_DIALOGUE_STATE",
  SET_QUANTITY: "SET_QUANTITY",
  SET_DELIVERY_PLACE: "SET_DELIVERY_PLACE",
  RESET_STATE: "RESET_STATE",
};

function extractOrderId(text: string) {
  const match = text.match(/ORD\d+/);
  return match ? match[0] : null;
}

function searchProducts(inputMessage: string) {
  const searchTermAll = inputMessage.toLowerCase().split(" ");
  const searchTerm = searchTermAll.filter((term) => term.length > 4);
  const matchProducts = productsList.filter((product) => {
    return searchTerm.some((term) => {
      return (
        product.name.toLocaleLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    });
  });
  return matchProducts.length > 0 ? matchProducts : null;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatContextProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);
  const [isTyping, setIsTyping] = useState(false);

  // reset the chat
  const resetChat = () => {
    dispatch({ type: actionTypes.SET_PENDING, payload: false });
    dispatch({
      type: actionTypes.RESET_STATE,
      payload: {
        dialogueState: "start",
        dialogueStep: "",
      },
    });
  };

  // show order confirmation
  const showOrderConfirmationMessage = async (quantity: number) => {
    const { deliveryLocation, productSelectedToOrder } = state;
    console.log(state);
    const product = productsList.find((p) => p.id === productSelectedToOrder);
    await addMessage(
      `Hajurko order confirm garnuhos:\nProduct name: ${
        product?.name
      }\nQuantity: ${quantity}\nTotal Price: ${
        quantity * product?.price!
      }\nDelivery Location: ${deliveryLocation}`,
      "AI"
    );
    await addMessage("Order confirm garnuhos", "AI");
    await addMessage("Confirm Order", "AI", "button");
  };

  // when the user order the product
  const setProductOrder = (productId: number) => {
    dispatch({
      type: actionTypes.SET_ORDER,
      payload: productId,
    });
    const product = productsList.find((p) => p.id === productId);
    handleUserMessage(`${product?.name} order garne`);
  };

  // when the user confirm the order
  const orderProductHandler = async (userResponse: boolean) => {
    if (state.dialogueState === "start") {
      return;
    }
    if (userResponse) {
      await addMessage("Hunxa ma order garxu", "user");
      showOrderProductDetails();
    } else {
      await addMessage("order cancel garxu", "user");
      await addMessage("Hajurko order cancel gariyo hai", "AI");
      resetChat();
    }
  };

  // show the order details after confirmation
  const showOrderProductDetails = async () => {
    const { quantity, deliveryLocation, productSelectedToOrder } = state;
    const product = productsList.find((p) => p.id === productSelectedToOrder);
    await addMessage(
      `Hajurko order confirm vayo:\nProduct name: ${
        product?.name
      }\nQuantity: ${quantity}\nTotal Price: ${
        quantity * product?.price!
      }\nDelivery Location: ${deliveryLocation}`,
      "AI"
    );
    await addMessage("Delivery huna 2-3 din lagxa", "AI");
    await addMessage(
      "Tapai aafno order track gardai garnu hola, hajurko order number ORD12345 ho",
      "AI"
    );
    resetChat();
  };

  // when the user type message
  const handleUserMessage = async (inputMessage: any) => {
    await addMessage(inputMessage, "user");

    const dialogueState = state.dialogueState;
    const dialogueStep = state.dialogueStep;

    console.log(dialogueState, dialogueStep);

    switch (dialogueState) {
      case "Order Product":
        if (dialogueStep === "get-product-name") {
          const productsAvailable = searchProducts(inputMessage);
          if (productsAvailable) {
            await addMessage(
              `${inputMessage} - ${productsAvailable.length} wata products vetito.`,
              "AI"
            );
            for (const product of productsAvailable) {
              await addMessage(`${product.id}`, "AI", "product");
            }
            await addMessage(
              "Kun product order garna chahanu hunxa click garnuhos",
              "AI"
            );
            dispatch({
              type: actionTypes.SET_DIALOGUE_STATE,
              payload: {
                dialogueState: "Order Product",
                dialogueStep: "order-product",
              },
            });
          } else {
            await addMessage(
              `${inputMessage} - name vako product vetiyena arko keyword type garnuhos`,
              "AI"
            );
          }
        } else if (dialogueStep === "order-product") {
          await addMessage(
            "Hami cash on delivery accept garxau. Return hajurle order gareko 7 din samma garna paunu hunexa",
            "AI"
          );
          await addMessage("Delivery location vannuhos", "AI");
          dispatch({
            type: actionTypes.SET_DIALOGUE_STATE,
            payload: {
              dialogueState: "Order Product",
              dialogueStep: "get-delivery-location",
            },
          });
        } else if (dialogueStep === "get-delivery-location") {
          dispatch({
            type: actionTypes.SET_DELIVERY_PLACE,
            payload: inputMessage,
          });
          await addMessage(
            "kati wata order garnu hunxa quantity vannuhos",
            "AI"
          );
          dispatch({
            type: actionTypes.SET_DIALOGUE_STATE,
            payload: {
              dialogueState: "Order Product",
              dialogueStep: "get-quantity",
            },
          });
        } else if (dialogueStep === "get-quantity") {
          const quantity = parseInt(inputMessage);
          if (isNaN(quantity)) {
            await addMessage("Kripaya valid quantity number dinuhos", "AI");
          } else {
            dispatch({
              type: actionTypes.SET_QUANTITY,
              payload: quantity,
            });
            showOrderConfirmationMessage(quantity);
          }
        }
        break;
      case "Order Tracking":
        // get the order id from user
        const orderId = extractOrderId(inputMessage);
        if (!orderId) {
          setIsTyping(true);
          return addMessage(
            "Kripaya order number dinuhos jun ORD baata suru hunxa jastei ORD99999",
            "AI"
          );
        }
        // fetch the database
        await addMessage("Hajurko order processing hudei xa", "AI");
        resetChat();
        break;
      case "Browse Products":
        // get the product name and search for the match product
        if (dialogueStep === "get-product-name") {
          console.log("Getting the product list");
          const foundProducts = searchProducts(inputMessage);
          console.log(foundProducts);
          if (foundProducts) {
            await addMessage(
              `${inputMessage} - ${foundProducts.length} wata products vetiyo.`,
              "AI"
            );
            // list the products in product card in message list
            for (const product of foundProducts) {
              await addMessage(`${product.id}`, "AI", "product");
            }
            resetChat();
          } else {
            await addMessage(
              `Maaf garnu hola ${inputMessage} vetiyena, aru kunei product type garnuhola`,
              "AI"
            );
          }
        }
        break;
      default:
        return;
    }
  };

  const addMessage = async (
    message: string,
    sender: "AI" | "user",
    type = "text"
  ) => {
    if (sender === "AI") {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch({
        type: actionTypes.ADD_MESSAGE,
        payload: { sender: "AI", message, type },
      });
      setIsTyping(false);
    } else {
      dispatch({
        type: actionTypes.ADD_MESSAGE,
        payload: { sender: "user", message, type },
      });
    }
  };
  // when the user choose one of the button option
  const handleUserInput = async (inputOption: string) => {
    switch (inputOption) {
      case "Browse Products":
        await addMessage("Ma products haru herna chahanxu", "user");
        dispatch({ type: actionTypes.SET_PENDING, payload: true });
        dispatch({
          type: actionTypes.SET_DIALOGUE_STATE,
          payload: {
            dialogueState: "Browse Products",
            dialogueStep: "get-product-name",
          },
        });
        await addMessage(
          "Hamro store ma sabai prakar ko electronics saman available xa. aile hami sanga\n1. Mobile\n2. Laptop\n3. Calculator\n4. TV\n5. Watch\nAvailable xa",
          "AI"
        );
        await addMessage("Kripaya products ko name type garnuhos", "AI");
        break;
      case "Order Tracking":
        await addMessage("Malai mero order status track garnu xa", "user");
        dispatch({ type: actionTypes.SET_PENDING, payload: true });
        dispatch({
          type: actionTypes.SET_DIALOGUE_STATE,
          payload: {
            dialogueState: "Order Tracking",
            dialogueStep: "get-order-id",
          },
        });
        await addMessage("Kripaya hajurko order number dinuhos", "AI");
        break;

      case "Contact Support":
        await addMessage("Malai contact support garnu xa", "user");
        dispatch({ type: actionTypes.SET_PENDING, payload: true });
        break;

      case "Order Product":
        await addMessage("Ma saman order garna chahanxu", "user");
        dispatch({ type: actionTypes.SET_PENDING, payload: true });
        dispatch({
          type: actionTypes.SET_DIALOGUE_STATE,
          payload: {
            dialogueState: "Order Product",
            dialogueStep: "get-product-name",
          },
        });
        await addMessage(
          "Kun product order garna chahanu hunxa product ko name vannu hos",
          "AI"
        );
        break;
      default:
        await addMessage("Galat input", "user");
        break;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        handleUserMessage,
        handleUserInput,
        isTyping,
        setProductOrder,
        orderProductHandler,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
