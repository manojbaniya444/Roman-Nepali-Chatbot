import json

replacement_text = r"D:\\Roman Nepali Chatbot\\Intent Classification\data\\replacement.json"

with open(replacement_text, "r") as f:
    file_data = json.load(f)
    
replacement_keys = file_data["replacement"].values()
replacement_keys = [k for key in replacement_keys for k in key]
replacement_values = list(file_data["replacement"].keys())

mapping_key_value = dict()

for key, values in file_data["replacement"].items():
    new_key_value = {
        new_value: key for new_value in values
    }
    mapping_key_value.update(new_key_value)
    
def preprocess_text(sentence):
    """Get the sentence and then correct the Roman Nepali text like cha xa chha to common"""
    replaced_text = ""
    for word in sentence.split():
        if word in replacement_keys:
            replaced_text = replaced_text + " " + mapping_key_value[word]
        else:
            replaced_text = replaced_text + " " + word
            
    return replaced_text.lower().strip()