import React from "react";

const Typing: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce delay-100"></div>
      <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce delay-100"></div>
    </div>
  );
};

export default Typing;
