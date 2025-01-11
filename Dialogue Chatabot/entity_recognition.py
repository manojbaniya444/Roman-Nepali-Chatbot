MODEL = r"D:\\Roman Nepali Chatbot\\Dialogue Chatabot\\models\\crf_model.pkl"

import joblib
from sklearn_crfsuite import CRF
import re

feature_dict = {
    "brands": [
        "Xiaomi", "Samsung", "Casio", "Apple"
    ],
    "category": [
        "mobile", "TV", "calculator", "laptop"
    ]
}

class CRFModel:
    def __init__(self):
        self.feature_dict = feature_dict
        self.model = self._load_crf_model(MODEL)
        
    def _load_crf_model(self, model_path):
        model = joblib.load(model_path)
        return model
        
    def get_word_shape(self, word):
        shape = ""
        last_char_type = ""
    
        for char in word:
            if char.isupper():
                char_type = "X"
            elif char.islower():
                char_type = "x"
            elif char.isdigit():
                char_type = "d"
            else:
                char_type = char
            if char_type != last_char_type:
                shape += char_type
                last_char_type = char_type
        return shape
    
    def get_ecommerce_features(self, sentence:list[str], index: int) -> dict:
        """
         a feature dictionary for a given word in a sentence.
    
        Args:
            sentence: list of words in a sentence
            index: index of the word in the sentence
        Returns:
        dict: features
        """
        features = dict()
        word = sentence[index]
    
        features.update(
        {
            "has_number": bool(re.search(r"\d", word)),
            "is_brand": word.lower() in feature_dict["brands"],
            "is_category": word.lower() in feature_dict["category"],
            "word_shape": self.get_word_shape(word)
        }
        )
    
        if index < len(sentence) - 1:
            word_next = sentence[index + 1]
            features.update({
            "next_word.lower": word_next.lower(),
            "next_word.istitle": word_next.istitle(),
            "next_word.isupper": word_next.isupper(),
            "next_word.isdigit": word_next.isdigit()
            })
        else:
             features["EOS"] = True
    
        if index > 0:
            word_prev = sentence[index - 1]
            features.update({
            "prev_word.lower": word_prev.lower(),
            "prev_word.istitle": word_prev.istitle(),
            "prev_word.isupper": word_prev.isupper(),
            "prev_word.isdigit": word_prev.isdigit()
            })
        else:
            features["BOS"] = True
        
        return features
    
    def predict(self, sentence):
        sentence = sentence.split()
        sentence_features = [self.get_ecommerce_features(sentence, i) for i in range(len(sentence))]
        predictions = self.model.predict([sentence_features])[0]
        return predictions


if __name__ == "__main__":
    model = CRFModel()
    while True:
        question = input("Type question: ")
        response = model.predict(question)
        print(response)
