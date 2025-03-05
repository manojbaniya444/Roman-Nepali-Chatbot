export type AiState = {
  dialogue_states: {
    entity: any[];
    intent: string;
    intent_satisfied: boolean;
    missing_entity: string[];
  };
  entities: any;
  probabilities: any;
};

export type AiResponseType = {
  response: string;
  states: AiState;
};

export const fetchAiResponse = async (userMessage: string) => {
  const userSessionId = 1;
  try {
    const response = await fetch(
      `http://localhost:8000/chat/${userSessionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage }),
      }
    );
    if (response.status === 200) {
      const aiResponse: AiResponseType = await response.json();
      return aiResponse;
    }
  } catch (error) {
    console.log("Error fetching ai response: ", error);
  }
};

export const resetChatState = async () => {
  const userSessionId = 1;
  try {
    const response = await fetch(
      `http://localhost:8000/resetChat?session_id=${userSessionId}`, {
      method: "POST"
      }
    );
    const resetResponse = await response.json()
    console.log(resetResponse)
    console.log("Chat reset success");
  } catch (error) {
    console.log("Error reseting chat", error);
  }
};
