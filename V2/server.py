from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import pyttsx3
import json
import requests
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize speech recognition and text-to-speech engines
recognizer = sr.Recognizer()
engine = pyttsx3.init()

# Gemini API configuration
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"  # Replace with your actual API key
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

def load_user_data():
    """Load user data from JSON file"""
    try:
        with open('data.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {"users": []}

def get_user_data(user_id):
    """Get specific user data"""
    data = load_user_data()
    return next((user for user in data["users"] if user["user_id"] == user_id), None)

def convert_json_to_text(user_data):
    """Convert user financial data to natural language text"""
    if not user_data:
        return "No user data available."

    name = user_data.get("Name", "Unknown")
    financial_data = user_data.get("financial_data", {})
    
    # Format income data
    income = financial_data.get("income", {})
    income_text = []
    if income.get("salary"):
        income_text.append(f"${income['salary']} from salary")
    if income.get("freelance"):
        income_text.append(f"${income['freelance']} from freelance work")
    if income.get("other"):
        income_text.append(f"${income['other']} from other sources")
    
    # Format expenses data
    expenses = financial_data.get("expenses", {})
    expense_text = []
    for category, amount in expenses.items():
        if amount:
            expense_text.append(f"${amount} on {category}")
    
    # Format savings data
    savings = financial_data.get("savings", {})
    savings_text = []
    for category, amount in savings.items():
        if amount:
            savings_text.append(f"${amount} in {category.replace('_', ' ')}")
    
    # Compile the text
    text_parts = [f"My name is {name}."]
    if income_text:
        text_parts.append("I earn " + ", ".join(income_text) + ".")
    if expense_text:
        text_parts.append("I spend " + ", ".join(expense_text) + ".")
    if savings_text:
        text_parts.append("I have " + ", ".join(savings_text) + ".")
    
    return " ".join(text_parts)

def query_gemini(prompt):
    """Send query to Gemini API"""
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    try:
        response = requests.post(GEMINI_URL, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        
        if "candidates" in result and result["candidates"]:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        return "I couldn't generate a response at this time."
    
    except requests.exceptions.RequestException as e:
        print(f"Gemini API error: {e}")
        return "Sorry, I encountered an error while processing your request."

def create_financial_prompt(user_query, user_data):
    """Create a prompt for Gemini with user context"""
    user_context = convert_json_to_text(user_data)
    return f"""
    As a financial advisor, please help with this query:

    User Context: {user_context}
    User Question: {user_query}

    Please provide clear, concise advice based on the user's financial situation.
    Focus on practical, actionable steps.
    Keep the response under 200 words.
    """

@app.route('/process-query', methods=['POST'])
def process_query():
    """Handle voice/text queries and return AI responses"""
    try:
        data = request.json
        user_id = data.get('user_id')
        query_type = data.get('query')
        
        # Get user data
        user_data = get_user_data(user_id)
        if not user_data:
            return jsonify({"error": "User not found"}), 404

        # Handle speech recognition if query is "listening_start"
        if query_type == "listening_start":
            with sr.Microphone() as source:
                print("Adjusting for ambient noise...")
                recognizer.adjust_for_ambient_noise(source, duration=1)
                print("Listening...")
                try:
                    audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
                    user_query = recognizer.recognize_google(audio)
                    print(f"Recognized: {user_query}")
                except sr.WaitTimeoutError:
                    return jsonify({"error": "No speech detected"}), 400
                except sr.UnknownValueError:
                    return jsonify({"error": "Could not understand audio"}), 400
                except sr.RequestError:
                    return jsonify({"error": "Speech service error"}), 500
        else:
            user_query = query_type

        # Generate and get response from Gemini
        prompt = create_financial_prompt(user_query, user_data)
        ai_response = query_gemini(prompt)
        
        # Log the interaction
        log_interaction(user_id, user_query, ai_response)
        
        return jsonify({"response": ai_response})

    except Exception as e:
        print(f"Error processing query: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

def log_interaction(user_id, query, response):
    """Log user interactions to a file"""
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "user_id": user_id,
        "query": query,
        "response": response
    }
    
    try:
        with open('interaction_logs.json', 'a') as file:
            json.dump(log_entry, file)
            file.write('\n')
    except Exception as e:
        print(f"Error logging interaction: {e}")

if __name__ == '__main__':
    app.run(debug=True)