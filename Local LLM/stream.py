from transformers import TextIteratorStreamer, AutoModelForCausalLM, AutoTokenizer
from threading import Thread

tokenizer = AutoTokenizer.from_pretrained("openai-community/gpt2", cache_dir="./model")
model = AutoModelForCausalLM.from_pretrained("openai-community/gpt2", cache_dir="./model")

def get_stream_response(input_text="", max_length=100):
    streamer = TextIteratorStreamer(tokenizer, skip_prompt=False)
    inputs = tokenizer(input_text, return_tensors="pt")
    generation_kwargs = dict(inputs, streamer=streamer, max_new_tokens=max_length)
    thread = Thread(target=model.generate, kwargs=generation_kwargs)
    thread.start()
    for new_text in streamer:
        print(new_text, end="")
        
get_stream_response("The idea to")