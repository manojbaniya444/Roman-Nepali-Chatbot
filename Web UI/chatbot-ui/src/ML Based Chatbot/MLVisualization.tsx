import React from "react";
import { AiResponseType } from "./api";

type Prop = {
  aiResponse: AiResponseType | null;
};

const MLVisualization = ({ aiResponse }: Prop) => {
  console.log(aiResponse);

  return (
    <div className="flex-1 py-5 flex flex-col px-5 gap-5 bg-white">
      {/* <button
        className="bg-gray-100 px-4 py-2 rounded-lg"
        onClick={resetChatHandler}
      >
        Reset Chat
      </button> */}

      {/* // AI Response */}
      {aiResponse?.response && (
        <h1 className="font-thin">
          <span className="font-bold text-xl">AI Response: </span>
          {aiResponse.response}
        </h1>
      )}

      {/* // Entities Recognition */}
      {aiResponse && aiResponse.states.entities && (
        <div>
          <h1 className="text-xl font-bold">
            Entity Recognition on latest message:
          </h1>
          {Object.entries(aiResponse.states.entities).map(
            (entities: [string, any], index) => {
              return (
                <div key={index}>
                  <p>
                    <strong className="text-sm text-slate-800">
                      {entities[0]}
                    </strong>
                    :{" "}
                    {entities[1] ? (
                      <span className="text-orange-500 font-bold">
                        {entities[1]}
                      </span>
                    ) : (
                      "Not Found"
                    )}
                  </p>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* // model intents */}
      {aiResponse && (
        <div>
          <p
            className={`${
              aiResponse.states.dialogue_states.intent_satisfied
                ? "text-green-500"
                : "text-orange-500"
            } font-semibold text-normal`}
          >
            <span className="font-bold text-black">Intent Status: </span>
            {aiResponse.states.dialogue_states.intent_satisfied
              ? "All Intent satisfied, can ask new question"
              : `Intent not satisfied, working on Intent: <${aiResponse.states.dialogue_states.intent}>`}
          </p>
          <p className="text-xl font-bold">Missing Entities: </p>
          {aiResponse.states.dialogue_states.missing_entity.length > 0 ? (
            aiResponse.states.dialogue_states.missing_entity.map((entity) => {
              return (
                <p
                  key={entity}
                  className="text-orange-600 font-semibold text-lg"
                >
                  {entity}
                </p>
              );
            })
          ) : (
            <p className="text-lg text-green-500">
              None missing entity, all good
            </p>
          )}
        </div>
      )}
      {/* // probabilities */}
      {aiResponse?.states.probabilities && (
        <div className="flex flex-col bg-slate-100 p-2 rounded-lg">
          <h1 className="font-bold text-xl">Model Probabilities</h1>
          {Object.entries(aiResponse.states.probabilities).map(
            (intent: [string, any], index) => {
              return (
                <div
                  className="flex items-center gap-1 justify-center p-1"
                  key={index}
                >
                  <p className="w-[140px] text-sm">
                    {intent[0]}{" "}
                    <span className="text-black text-sm font-bold">
                      ({(intent[1] * 100).toFixed(2)}%)
                    </span>
                  </p>
                  <div className="flex-1 bg-gray-200 rounded-l-md h-6 relative">
                    <div
                      className="bg-blue-600 h-6 rounded-l-md transition-all duration-500 ease-in-out"
                      style={{ width: `${(intent[1] * 100).toFixed(2)}%` }}
                    ></div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default MLVisualization;
