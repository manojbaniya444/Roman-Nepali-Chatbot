import React, { useState, useRef, useEffect } from "react";

const LLMPlayground = () => {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      message:
        "Hi hajur lai swagat xa ma AI Assistant hajurlai ke sahayog garna sakxu.",
    },
  ]);

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, aiResponse]);

  // Create a ref to store the current question
  const currentQuestion = useRef("");

  const sendQuestion = async () => {
    if (!question) {
      alert("Please enter a question.");
      return;
    }

    // Store the current question
    currentQuestion.current = question;

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        sender: "User",
        message: question,
      },
    ]);

    setAiResponse("");
    setQuestion(""); // Clear input after sending

    try {
      const response = await fetch(`${import.meta.env.VITE_NGROK_SERVER}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const formattedText = text.replace(/data: /g, "").replace(/\n\n/g, "");

        if (formattedText === "<eos>") {
          setMessages((prev) => [
            ...prev,
            {
              sender: "AI",
              message: accumulatedResponse,
            },
          ]);
          setAiResponse("")
          return;
        }

        accumulatedResponse += formattedText;
        setAiResponse(accumulatedResponse);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          message: "Sorry, there was an error processing your request.",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto h-dvh">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          className="border border-gray-300 rounded-xl p-2 w-full"
        />
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Enter context (optional)"
          className="border border-gray-300 rounded-xl p-2 w-full"
        />
        <button
          onClick={sendQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </div>

      <div
        className="flex flex-col gap-2 p-2 border-1 rounded-xl h-full flex-1 overflow-y-scroll"
        ref={messagesRef}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.sender === "AI"
                ? "bg-gray-500 self-start"
                : "bg-blue-500 self-end"
            } text-white p-3 rounded-lg max-w-[70%]`}
          >
            <p className="whitespace-pre-wrap break-words">{msg.message}</p>
          </div>
        ))}
        {aiResponse && (
          <div className="bg-gray-500 self-start text-white p-3 rounded-lg max-w-[70%]">
            <p className="whitespace-pre-wrap break-words">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LLMPlayground;
