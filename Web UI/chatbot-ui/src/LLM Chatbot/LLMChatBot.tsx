import React, { Dispatch, useEffect, useRef, useState } from "react";
import Button from "../components/Button";

type Props = {
  setShowChat: Dispatch<React.SetStateAction<boolean>>;
};

type Message = {
  sender: "AI" | "user";
  message: string;
};

const LLMChatBot = ({ setShowChat }: Props) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "AI",
      message: "Hello hajurlai kasari sahayog garna sakxu?",
    },
  ]);
  const [question, setQuestion] = useState<string>("");
  const [aiResponse, setAiResponse] = useState("");

  const messagesRef = useRef<HTMLDivElement>(null);

  const context =
    "Hamro store ko name All Electronics store ho.\nHamro store Dharan ma xa.\nHamro store ko contact no: 980000000000 ho";

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, aiResponse]);

  // Create a ref to store the current question
//   const currentQuestion = useRef("");

  // message sending handler
  const handleMessagePost = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuestion();
  };

  const sendQuestion = () => {
    if (!question) {
      alert("Please enter a question.");
      return;
    }

    // currentQuestion.current = question;

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        message: question,
      },
    ]);

    setAiResponse("");
    setQuestion(""); // Clear input after sending

    fetch("https://2daa-35-230-9-191.ngrok-free.app/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        context,
        stream: true,
      }),
    })
      .then((response) => {
        if (!response.body) {
          throw new Error("Response body is null");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let accumulatedResponse = "";

        function read() {
          reader.read().then(({ done, value }) => {
            if (done) return;

            const text = decoder.decode(value);
            const formattedText = text
              .replace(/data: /g, "")
              .replace(/\n\n/g, "");

            if (formattedText === "<eos>") {
              setMessages((prev) => [
                ...prev,
                {
                  sender: "AI",
                  message: accumulatedResponse,
                },
              ]);
              setAiResponse("");
              return;
            }

            accumulatedResponse += formattedText;
            setAiResponse(accumulatedResponse);
            read();
          });
        }
        read();
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            sender: "AI",
            message: "Sorry, there was an error processing your request.",
          },
        ]);
      });
  };

  return (
    <div className="fixed right-2 bottom-2 h-[600px] w-[400px] bg-slate-100 shadow-2xl z-10 flex flex-col">
      {/* //  header of chatbot */}
      <div className="flex justify-between items-center p-2 bg-blue-500 text-white">
        <h1 className="font-bold">AI Chatbot</h1>
        <Button onClick={() => setShowChat(false)} className="cursor-pointer">
          X
        </Button>
      </div>

      {/* // messages list */}
      <div ref={messagesRef} className="flex flex-col gap-2 flex-1 px-2 py-4 overflow-y-scroll">
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={`${
                msg.sender === "AI"
                  ? "bg-slate-200 text-black self-start"
                  : "bg-blue-500 text-white font-normal self-end "
              } w-[70%] p-2 rounded-xl`}
            >
              {msg.message}
            </div>
          );
        })}
        {aiResponse && (
          <div className="bg-slate-200 text-black self-start w-[70%] p-2 rounded-xl">
            {/* <p className="whitespace-pre-wrap break-words">{aiResponse}</p> */}
            {aiResponse}
          </div>
        )}
      </div>

      {/* // chat component */}
      <form
        className="flex justify-between items-center gap-1"
        onSubmit={handleMessagePost}
      >
        <input
          type="text"
          placeholder="ask question"
          className="border-1 p-2 flex-1"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button>Send</Button>
      </form>
    </div>
  );
};

export default LLMChatBot;
