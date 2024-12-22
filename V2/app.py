from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import requests
import json
import pyttsx3
from threading import Thread

app = Flask(__name__)
CORS(app)

# Initialize speech recognition
recognizer = sr.Recognizer()

# Gemini API details
GEMINI_API_KEY = "AIzaSyCjBzhIK77PTLujpC0h3Z9KLKOifCOdx8I"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

def query_gemini(input_text):
    """Call Gemini API with the input text."""
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{"text": input_text}]
        }]
    }
    try:
        response = requests.post(GEMINI_URL, headers=headers, data=json.dumps(payload))
        response.raise_for_status()
        result = response.json()

        if "candidates" in result and len(result["candidates"]) > 0:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        else:
            return "Sorry, I couldn't get a valid response from Gemini."
    except requests.exceptions.RequestException as e:
        return f"Error with Gemini API: {str(e)}"

def speak_text(text):
    """Speak the given text using pyttsx3."""
    def run_tts():
        engine = pyttsx3.init()  # Reinitialize TTS engine in the thread
        engine.say(text)
        engine.runAndWait()

    # Running TTS in a separate thread to avoid blocking the main thread
    thread = Thread(target=run_tts)
    thread.start()

@app.route('/process-query', methods=['POST'])
def process_query():
    """Handle voice queries and return Gemini responses."""
    try:
        print("Starting speech recognition...")
        
        # Initialize recognizer and microphone
        with sr.Microphone() as source:
            print("Adjusting for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            
            print("Listening for speech...")
            try:
                audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
                print("Recognizing speech...")
                text = recognizer.recognize_google(audio)
                print(f"Recognized text: {text}")
                
                # Query Gemini with the recognized text
                gemini_response = query_gemini(text)
                print(f"Gemini response: {gemini_response}")
                
                # Speak the response
                speak_text(gemini_response)
                
                return jsonify({
                    "response": gemini_response,
                    "status": "success",
                    "recognized_text": text
                })
                
            except sr.WaitTimeoutError:
                return jsonify({"error": "No speech detected", "status": "error"}), 400
            except sr.UnknownValueError:
                return jsonify({"error": "Could not understand audio", "status": "error"}), 400
            except sr.RequestError as e:
                return jsonify({"error": f"Speech recognition error: {str(e)}", "status": "error"}), 500
                
    except Exception as e:
        print(f"Error in process_query: {str(e)}")
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route('/test', methods=['GET'])
def test():
    """Test endpoint to verify server is running."""
    return jsonify({"status": "Server is running!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)