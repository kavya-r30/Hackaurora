# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import json
# import subprocess

# app = Flask(__name__)
# CORS(app)

# @app.route('/run-python-script', methods=['POST'])
# def run_script():
#     try:
#         # Call the Python script using subprocess
#         result = subprocess.run(['python', 'model.py'], capture_output=True, text=True)
#         return jsonify({"status": "success", "output": result.stdout})
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)})

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/process-voice', methods=['POST'])
def process_voice():
    data = request.get_json()  # Get the data sent from the frontend
    voice_command = data.get('command')  # Get the 'command' field
    
    if voice_command:
        # Process the voice command (this is a placeholder for your logic)
        print(f"Received voice command: {voice_command}")
        
        # Example response: you can add logic here to handle different commands
        if 'balance' in voice_command.lower():
            response = {"message": "Your balance is $5000."}
        else:
            response = {"message": "Sorry, I didn't understand that command."}
        
        return jsonify(response), 200  # Return the response to the frontend
    else:
        return jsonify({"error": "No command received"}), 400  # Handle missing command

if __name__ == '__main__':
    app.run(debug=True)
