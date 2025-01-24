import React from "react";
import { Link } from "react-router-dom";

import Button from "./components/Button";

const HomePage: React.FC = () => {
  return (
    // main page
    <div className="min-h-screen  flex flex-col items-center">
      {/* card */}
      <div className="w-full bg-white shadow-xl rounded-lg overflow-hidden">
        {/* // title */}
        <div className="bg-slate-200 text-blue-900 p-4 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Major Project Demonstration
          </h1>
          <p className="text-xl opacity-90 mt-2 font-bold text-blue-900">
            "A comprehensive Study on the Development of Roman Nepali Chatbot
            for Ecommerce"
          </p>
        </div>

        {/* // image */}
        <div className="flex justify-center p-4">
          <img
            src="./src/assets/campus-logo.png"
            alt="Purwanchal Campus"
            className="max-w-full h-auto object-contain"
          />
        </div>

        {/* // members of project */}
        <div className="flex flex-col items-center text-lg font-normal">
          <h1 className="font-bold text-xl">Project Members</h1>
          <p>Aakash Thakur</p>
          <p>Kshitiz Gajurel</p>
          <p>Manish Kathet</p>
          <p>Manoj Kumar Baniya</p>
          <h1 className="font-bold text-xl">Supervisor</h1>
          <p>Er. Pukar Karki</p>
        </div>

        {/* // button */}
        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="default" className="w-full">
              <Link to="/rule-based-chatbot" className="w-full text-center">
                Rule-Based Chatbot
              </Link>
            </Button>

            <Button variant="default" className="w-full">
              <Link to="/ml-chatbot" className="w-full text-center">
                ML Chatbot
              </Link>
            </Button>

            <Button variant="default" className="w-full">
              <Link to="/llm-chatbot" className="w-full text-center">
                LLM Chatbot
              </Link>
            </Button>
          </div>

          {/* // project info */}
          <div className="bg-blue-50 pt-4 rounded-md text-center">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              Project Highlights
            </h2>
            <p className="text-slate-800">
              Developing a chatbot for E-Commerce
              <br />
              <span className="text-slate-500">
                Rule Based | Machine Learning Based | Large Language Model Based
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
