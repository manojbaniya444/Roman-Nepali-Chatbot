import torch
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import LabelEncoder
from preprocess_text import preprocess_text
import pandas as pd

DATASET = r"D:\\Roman Nepali Chatbot\\Dialogue Chatabot\data\\intent_dataset.csv"
MODEL = r"D:\\Roman Nepali Chatbot\\Dialogue Chatabot\\models\best.pt"
HIDDEN_SIZE = 20

class IntentClassification(torch.nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.layer_1 = torch.nn.Linear(in_features=input_size, out_features=hidden_size)
        self.layer_2 = torch.nn.Linear(in_features=hidden_size, out_features=hidden_size)
        self.layer_3 = torch.nn.Linear(in_features=hidden_size, out_features=output_size)
        self.relu = torch.nn.ReLU()
        
    def forward(self, x):
        out = self.relu(self.layer_1(x))
        out = self.relu(self.layer_2(out))
        out = self.layer_3(out)
        return out

class IntentClassificationModel:
    def __init__(self):
        self.vectorizer = CountVectorizer()
        self.label_encoder = LabelEncoder()
        self._initialize_bow()
        self.model = self._load_model()

    def _initialize_bow(self):
        # load the data
        data = pd.read_csv(DATASET)
        text = data["text"].tolist()
        labels = data["intent"].tolist()
        self.vectorizer.fit_transform(text)
        self.label_encoder.fit_transform(labels)
        
        
    def _load_model(self):
        model = IntentClassification(
            input_size=len(self.vectorizer.vocabulary_),
            hidden_size=HIDDEN_SIZE,
            output_size=len(self.label_encoder.classes_)
        )
        model.load_state_dict(torch.load(MODEL, weights_only=True))
        model.eval()
        return model
        
    def id2label(self, id: int) -> str:
        classes = self.label_encoder.classes_
        return classes[id]
    
    def predict(self, sentence: str) -> str:
        if self.model is None:
            raise RuntimeError("No model loaded")
        sentence = preprocess_text(sentence=sentence)
        sentence_features = self.vectorizer.transform([sentence]).toarray()
        bow_tensor = torch.tensor(sentence_features, dtype=torch.float32)
        with torch.no_grad():
            pred = self.model(bow_tensor)
            pred = torch.softmax(pred, dim=-1)
            label = torch.argmax(pred, dim=-1)
            print(f"Probability", pred.max())
            
        predicted_intent = self.id2label(label)
        return predicted_intent if pred.max().item() > 0.80 else None
    
    
if __name__ == "__main__":
    model = IntentClassificationModel()
    intent = model.predict("mero order id ORD123 ko status ke cha")
    print(intent)