from flask import Flask, Response
import time
import json

app = Flask(__name__)

def generate_llm_response():
    # Simulated LLM response broken into tokens
    response = "Hello! I am an AI assistant. How can I help you today?"
    tokens = response.split()
    
    for token in tokens:
        # Create a JSON event with the token
        data = json.dumps({"token": token + " "})
        yield f"data: {data}\n\n"
        time.sleep(0.2)  # Simulate thinking time between tokens
    
    # Send a completion event
    yield f"data: {json.dumps({'done': True})}\n\n"

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/stream')
def stream():
    return Response(
        generate_llm_response(),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    )

if __name__ == '__main__':
    app.run(debug=True)