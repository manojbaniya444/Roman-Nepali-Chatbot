import React, { useState } from "react";
import { Product, productsList } from "./data/productsData";
import ProductCard from "./components/ProductCard";
import ChatBot from "./ChatBot";

import { MessageCircleMore } from "lucide-react";

type Props = {};

const RuleBasedPage = (props: Props) => {
  const [showChat, setShowChat] = useState<boolean>(false);
  return (
    <div className="md:h-dvh h-full w-full flex flex-col bg-slate-200">
      {/* // Navbar */}
      <nav className="bg-blue-600 text-white text-center text-3xl p-4">
        <h1 className="font-bold">All Electronics Store</h1>
      </nav>
      {/* // Products Page */}
      <div className="flex gap-4 flex-wrap justify-center p-4">
        {productsList &&
          productsList.map((product: Product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
      </div>
      {/* // chatbot */}
      <button
        className="fixed bottom-4 right-4 bg-blue-900 text-white p-2 rounded-full shadow-lg cursor-pointer"
        onClick={() => setShowChat(!showChat)}
      >
        <MessageCircleMore />
      </button>
      {showChat && <ChatBot setShowChat={setShowChat} />}
    </div>
  );
};

export default RuleBasedPage;
