import { Link } from "react-router-dom";
import { productsList } from "../data/productsData";
import { useChatContext } from "../context/ChatContext";
import { ChatContextType } from "../types";

type Message = {
  message: string;
  sender: "AI" | "user";
  type: "text" | "product" | "button";
};

const ChatMessage = ({ message }: { message: Message }) => {
  const { state, setProductOrder, orderProductHandler } =
    useChatContext() as ChatContextType;

  const { dialogueState, dialogueStep } = state;
  console.log(dialogueState, dialogueStep);
  if (message.type === "text") {
    return (
      <div
        className={`${
          message.sender === "AI"
            ? "bg-slate-100 self-start text-black"
            : "self-end bg-blue-500 text-white"
        } p-1 rounded-md max-w-[70%] text-xs md:text-sm`}
        style={{ whiteSpace: "pre-wrap" }}
      >
        <div>{message.message}</div>
      </div>
    );
  }
  if (message.type === "button") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => orderProductHandler(true)}
          className="bg-blue-500 rounded-md text-normal text-white p-2 cursor-pointer"
        >
          Confirm Order
        </button>
        <button
          onClick={() => orderProductHandler(false)}
          className="bg-slate-200 p-2 rounded-md text-normal cursor-pointer"
        >
          Cancel Order
        </button>
      </div>
    );
  } else {
    const productId = parseInt(message.message);
    const product = productsList.find((product) => product.id === productId);

    if (dialogueState === "Order Product" && dialogueStep === "order-product") {
      return (
        <div
          className="bg-white max-w-[130px] flex flex-col items-start p-1 border-2 rounded-lg cursor-pointer hover:animate-pulse"
          onClick={() => setProductOrder(product?.id!)}
        >
          <p className="text-sm font-semibold">{product?.name}</p>
          <div>
            <img
              src={product?.imageUrl}
              alt={product?.name}
              width={50}
              height={50}
            />
          </div>
          <p className="text-sm font-bo">Rs. {product?.price}</p>
        </div>
      );
    }
    return (
      <Link to={`/rule-based-chatbot/${product?.id}`}>
        <div className="bg-white max-w-[130px] flex flex-col items-start p-1 border-2 rounded-lg">
          <p className="text-sm font-semibold">{product?.name}</p>
          <div>
            <img
              src={product?.imageUrl}
              alt={product?.name}
              width={50}
              height={50}
            />
          </div>
          <p className="text-sm font-bo">Rs. {product?.price}</p>
        </div>
      </Link>
    );
  }
};

export default ChatMessage;
