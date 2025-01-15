import json
import pandas as pd

file_name = r"D:\\Roman Nepali Chatbot\Dataset\\Instruction Fine Tune Dataset\\data_1.json"

df = pd.DataFrame({}, columns=["category", "instruction", "question", "context", "response"])

with open(file_name, "r") as f:
    data = f.read()
    
json_data = json.loads(data)


new_df = []
for row in json_data:
    question = row["question"]
    context = row["context"]
    response = row["response"]
    system = "Talako instruction herera user le gareko question ko Roman Nepali Language ma answer vana\n\n"
    instruction = "User le gareko question lai, context herera mildo answer deu\n"
    
    new_df.append({
        "system": system,
        "instruction": instruction,
        "question": question,
        "context": context,
        "response": response
    })

df_new = pd.DataFrame(new_df)
pd.concat(df, df_new,ignore_index=True)