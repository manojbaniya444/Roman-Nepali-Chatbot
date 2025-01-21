from intent_classification_model import IntentClassificationModel
from entity_recognition import CRFModel
from chatbot import EcommerceBot
import random

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

intent_model = IntentClassificationModel()
entity_model = CRFModel()

sessions = dict()

greetings = [
    "Namaskar, Hajurlai k sahayog garna sakchu?",
    "Hello ma All Electronics store ko AI Chatbot hajurlai ke sahayog garna sakchu?",
    "Namaste ma k sahayog garna sakchu."
]

class Question(BaseModel):
    question: str

def chat_with_bot(question: str, bot: EcommerceBot) -> str:    
    if any(word in ["hello", "hi", "namaskar", "namaste"] for word in question.lower().split()):
        return random.choice(greetings)
    response = bot.process_message(question)
    return response
    
@app.post("/chat/{session_id}")
async def chat(session_id: str, question: Question):
    if session_id in sessions:
        bot = sessions.get(session_id)
    else:
        bot = EcommerceBot(intent_model=intent_model, entity_model=entity_model)
        sessions[session_id] = bot
        
    response = chat_with_bot(question.question, bot)
    chat_states = bot.get_chat_states()
    return {"response": response, "states": chat_states}

if __name__ == "__main__":
    bot = EcommerceBot(intent_model, entity_model)
    while True:
        question = input("You: ")
        response = chat_with_bot(question, bot)
        print(f"Bot: {response}")