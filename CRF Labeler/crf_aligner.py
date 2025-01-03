import json

def tokenize_and_align(data):
    aligned_data = []
    # iterate over each sample in json data
    for sample in data:
        print(f"For Text: {sample["text"]}")
        completed_tokens_index = []
        text = sample["text"] # text from the sample
        entities = sample["entities"] # all entities from sample text
        tokens = text.split()
        
        labels = ["O"] * len(tokens)
        
        # looping through each entity in entities
        for entity in entities:
            entity_text = entity["text"]
            entity_label = entity["label"]
            entity_start = entity["start"]
            entity_end = entity["end"]
            print(completed_tokens_index)
            # continue if the index is already assigned
            # each token with index in a single sentence
            for index, token in enumerate(tokens):
                # if token is already aligned then continue
                
                # if token is in entity text then align entity
                if token in entity_text and index not in completed_tokens_index:
                    labels[index] = "B-" + entity_label
                    # adding the completed index token to avoid re-writing
                    completed_tokens_index.append(index)
                    print(f"Adding {index} to completed_tokens_index")
                    # if the entity text has more than one text in it
                    # loop after the next token till all next tokens in it
                    if len(entity_text.split()) > 1:
                        for new_idx in range(index + 1, index + len(entity_text.split())):
                            labels[new_idx] = "I-" + entity_label
                            completed_tokens_index.append(new_idx)
                            print(f"Added new {new_idx} to completed_tokens_index")
                        
        aligned_data.append((tokens, labels))
        print("*******DONE FOR THE SAMPLE********************\n")
            
    return aligned_data

def align_entities(filename):
    with open(filename, "r") as file:
        data = json.load(file)
    aligned_data = tokenize_and_align(data)
    return aligned_data
        
if __name__ == "__main__":
    aligned_data = align_entities("./data/labeled_data_01.json")
    if aligned_data:
        with open("./data/aligned_data.json", "w") as f:
            json.dump(aligned_data, f, indent=4)