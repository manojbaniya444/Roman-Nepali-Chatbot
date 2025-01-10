from intent_classification_model import IntentClassificationModel
from entity_recognition import CRFModel
from preprocess_text import preprocess_text
from chatbot import EcommerceBot
import random

intent_model = IntentClassificationModel()
entity_model = CRFModel()

bot = EcommerceBot(intent_model, entity_model)

greetings = [
    "Namaskar, Hajurlai k sahayog garna sakchu?",
    "Hello ma All Electronics store ko AI Chatbot hajurlai ke sahayog garna sakchu?",
    "Namaste ma k sahayog garna sakchu."
]

def chat_with_bot(question: str) -> str:    
    if any(word in ["hello", "hi", "namaskar", "namaste"] for word in question.lower().split()):
        return random.choice(greetings)
    response = bot.process_message(question)
    return response
    
if __name__ == "__main__":
    while True:
        question = input("You: ")
        response = chat_with_bot(question)
        print(f"Bot: {response}")