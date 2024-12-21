from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize speech recognition
recognizer = sr.Recognizer()

@app.route('/process-query', methods=['POST'])
def process_query():
    """Handle voice queries and return responses"""
    try:
        print("Starting speech recognition...")
        
        # Initialize recognizer and microphone
        with sr.Microphone() as source:
            # Adjust for ambient noise
            print("Adjusting for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            
            # Listen for speech
            print("Listening for speech...")
            try:
                audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
                
                # Convert speech to text
                print("Recognizing speech...")
                text = recognizer.recognize_google(audio)
                print(f"Recognized text: {text}")
                
                # For now, just echo back what was heard
                return jsonify({
                    "response": f"I heard you say: {text}",
                    "status": "success",
                    "recognized_text": text
                })
                
            except sr.WaitTimeoutError:
                return jsonify({
                    "error": "No speech detected",
                    "status": "error"
                }), 400
            except sr.UnknownValueError:
                return jsonify({
                    "error": "Could not understand audio",
                    "status": "error"
                }), 400
            except sr.RequestError as e:
                return jsonify({
                    "error": f"Speech recognition error: {str(e)}",
                    "status": "error"
                }), 500
                
    except Exception as e:
        print(f"Error in process_query: {str(e)}")
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/test', methods=['GET'])
def test():
    """Test endpoint to verify server is running"""
    return jsonify({"status": "Server is running!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)