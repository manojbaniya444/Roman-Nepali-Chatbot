import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import RuleBasedPage from "./Rulebased Chatbot/RuleBasedPage";
import MLChatbotPage from "./ML Based Chatbot/MLChatbotPage";
import LLMChatbotPage from "./LLM Chatbot/LLMChatbotPage";
import { ChatContextProvider } from "./Rulebased Chatbot/context/ChatContext";
import ProductPage from "./Rulebased Chatbot/ProductPage";
import SingleProductPage from "./Rulebased Chatbot/SingleProductPage";
import { LLMContextProvider } from "./LLM Chatbot/LLMContext";
import LLMPlayground from "./LLM Chatbot/LLMPlayground";

const App = (): JSX.Element => {
  return (
    <ChatContextProvider>
      <LLMContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rule-based-chatbot" element={<RuleBasedPage />}>
              <Route index element={<ProductPage />} />
              <Route path=":id" element={<SingleProductPage />} />
            </Route>
            <Route path="/ml-chatbot" element={<MLChatbotPage />} />
            <Route path="/llm-chatbot" element={<LLMChatbotPage />} />
            <Route path="/llm-chatbot-playground" element={<LLMPlayground />} />
          </Routes>
        </BrowserRouter>
      </LLMContextProvider>
    </ChatContextProvider>
  );
};

export default App;
