from intent_classification_model import IntentClassificationModel
from entity_recognition import CRFModel
from chatbot import EcommerceBot
import random

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

intent_model = IntentClassificationModel()
entity_model = CRFModel()

sessions = dict()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

greetings = [
    "Namaskar, Hajurlai k sahayog garna sakchu?\nHajur lai ma order status track garna, product browse garna, product order garna assist garna sakxu.",
    "Hello ma All Electronics store ko AI Chatbot hajurlai ke sahayog garna sakchu?\nAvailable services:\n1. Order Tracking\n2. Browse Product \n 3. Order Product",
    "Namaste ma k sahayog garna sakchu.\nHajur lai ma order track garna, product order garna jasto kurama help garna xakxu."
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
    print(chat_states)
    return {"response": response, "states": chat_states}

@app.post("/resetChat/")
async def resetChat(session_id: str):
    if session_id in sessions:
        bot = sessions.get(session_id)
        bot._reset_dialogue()
        return {"response": "Chat reset"}
    else:
        return {"response": "No session found to reset."}

if __name__ == "__main__":
    bot = EcommerceBot(intent_model, entity_model)
    while True:
        question = input("You: ")
        response = chat_with_bot(question, bot)
        print(f"Bot: {response}")