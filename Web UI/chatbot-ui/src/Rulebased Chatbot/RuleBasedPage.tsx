import { useState } from "react";
import ChatBot from "./ChatBot";

import { MessageCircleMore } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const RuleBasedPage = () => {
  const [showChat, setShowChat] = useState<boolean>(false);
  return (
    <div className="h-full w-full flex flex-col bg-slate-200">
      {/* // Navbar */}
      <nav className="bg-blue-600 text-white text-center text-3xl p-4">
        <Link to="/rule-based-chatbot">
          <h1 className="font-bold">All Electronics Store</h1>
        </Link>
      </nav>
      {/* // product */}
      <Outlet />
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
