import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import RuleBasedPage from "./Rulebased Chatbot/RuleBasedPage";
import MLChatbotPage from "./ML Based Chatbot/MLChatbotPage";
import LLMChatbotPage from "./LLM Chatbot/LLMChatbotPage";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rule-based-chatbot" element={<RuleBasedPage />} />
        <Route path="/ml-chatbot" element={<MLChatbotPage />} />
        <Route path="/llm-chatbot" element={<LLMChatbotPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
