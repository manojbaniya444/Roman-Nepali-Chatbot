import React, { useState } from "react";
import { productsList } from "../Rulebased Chatbot/data/productsData";
import ProductCard from "../Rulebased Chatbot/components/ProductCard";
import Button from "../components/Button";
import LLMChatBot from "./LLMChatBot";
import { Link } from "react-router-dom";

type Props = {};

const LLMChatbotPage = (props: Props) => {
  const [showChat, setShowChat] = useState<boolean>(false);
  return (
    <div>
      <nav className="bg-blue-500 p-4 text-white">
        <Link to="/">
          <h1 className="text-4xl text-center font-bold">
            All Electronics Store
          </h1>
        </Link>
      </nav>
      {/* // products */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {productsList.map((p) => {
          return <ProductCard product={p} key={p.id} />;
        })}
      </div>
      {/* // chatbot */}
      {showChat && <LLMChatBot setShowChat={setShowChat} />}
      <Button
        className="fixed bottom-2 right-2"
        onClick={() => setShowChat(!showChat)}
      >
        Chat
      </Button>
    </div>
  );
};

export default LLMChatbotPage;
