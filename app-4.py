import os
import json
import requests
import pyttsx3
import speech_recognition as sr

# Set up Gemini API key
GEMINI_API_KEY = "AIzaSyCjBzhIK77PTLujpC0h3Z9KLKOifCOdx8I"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

# Initialize pyttsx3
engine = pyttsx3.init()

# Function: Recognize speech using `speech_recognition`
def recognize_speech():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening... Please speak clearly.")
        recognizer.adjust_for_ambient_noise(source)
        try:
            audio = recognizer.listen(source, timeout=5)
            print("Processing...")
            text = recognizer.recognize_google(audio)
            print(f"User said: {text}")
            return text
        except sr.UnknownValueError:
            print("Sorry, I couldn't understand the audio.")
            return None
        except sr.RequestError as e:
            print(f"Error with the speech recognition service: {e}")
            return None

# Function: Call Gemini API
def query_gemini(input_text):
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{"text": input_text}]
        }]
    }
    try:
        response = requests.post(GEMINI_URL, headers=headers, data=json.dumps(payload))
        response.raise_for_status()

        # Print the response for debugging
        print("Gemini API response:", response.json())

        result = response.json()

        if "candidates" in result and len(result["candidates"]) > 0:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        else:
            print("Error: 'candidates' key not found in the response.")
            return "Sorry, I couldn't get a valid response from Gemini."

    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return "Sorry, there was an error with the Gemini API."

# Function: Speak using pyttsx3
def speak_text(text):
    engine.say(text)
    engine.runAndWait()

# Function: Convert user data to text for Gemini prompt
def convert_json_to_text(user_data):
    name = user_data.get("Name", "Unknown")

    income = user_data.get("financial_data", {}).get("income", {})
    salary = income.get("salary", 0)
    freelance = income.get("freelance", 0)
    other_income = income.get("other", 0)

    expenses = user_data.get("financial_data", {}).get("expenses", {})
    rent = expenses.get("rent", 0)
    utilities = expenses.get("utilities", 0)
    groceries = expenses.get("groceries", 0)
    entertainment = expenses.get("entertainment", 0)
    transportation = expenses.get("transportation", 0)
    other_expenses = expenses.get("other", 0)

    savings = user_data.get("financial_data", {}).get("savings", {})
    emergency_fund = savings.get("emergency_fund", 0)
    retirement_fund = savings.get("retirement_fund", 0)
    other_savings = savings.get("other", 0)

    transactions = user_data.get("financial_data", {}).get("transactions", [])
    transaction_sentence = []
    for transaction in transactions:
        trans_type = transaction.get("type", "")
        trans_amount = transaction.get("amount", 0)
        trans_description = transaction.get("description", "")
        trans_date = transaction.get("date", "")

        if trans_type and trans_description:
            transaction_sentence.append(f"On {trans_date}, {trans_description} of ${trans_amount} as a {trans_type}.")

    sentence = f"My name is {name}."

    income_sentence = []
    if salary > 0:
        income_sentence.append(f"${salary} from salary")
    if freelance > 0:
        income_sentence.append(f"${freelance} from freelance work")
    if other_income > 0:
        income_sentence.append(f"${other_income} from other sources")
    if income_sentence:
        sentence += " I earn " + ", ".join(income_sentence) + "."

    expense_sentence = []
    if rent > 0:
        expense_sentence.append(f"${rent} on rent")
    if utilities > 0:
        expense_sentence.append(f"${utilities} on utilities")
    if groceries > 0:
        expense_sentence.append(f"${groceries} on groceries")
    if entertainment > 0:
        expense_sentence.append(f"${entertainment} on entertainment")
    if transportation > 0:
        expense_sentence.append(f"${transportation} on transportation")
    if other_expenses > 0:
        expense_sentence.append(f"${other_expenses} on other expenses")
    if expense_sentence:
        sentence += " I spend " + ", ".join(expense_sentence) + "."

    savings_sentence = []
    if emergency_fund > 0:
        savings_sentence.append(f"${emergency_fund} in my emergency fund")
    if retirement_fund > 0:
        savings_sentence.append(f"${retirement_fund} in my retirement fund")
    if other_savings > 0:
        savings_sentence.append(f"${other_savings} in other savings")
    if savings_sentence:
        sentence += " I have " + ", ".join(savings_sentence) + "."

    if transaction_sentence:
        sentence += " " + " ".join(transaction_sentence)

    return sentence

# Financial advisor prompt
def common_financial_prompt(user_query, user_data):
    user_details = convert_json_to_text(user_data)
    return f"""
You are a financial advisor. A user has the following financial question:

User's Details: {user_details}

User's Question: {user_query}

Please provide clear and actionable advice based on the user's query. The topics can include but are not limited to:
- Budgeting and expense management
- Loan options (e.g., home, car, personal loans)
- Investment strategies (e.g., stocks, bonds, retirement savings)
- Credit card recommendations
- Savings plans (e.g., emergency fund, retirement savings)
- Financial goal setting and planning

Your response should be:
1. **Clear**: Make sure your response is easy to understand.
2. **Actionable**: Offer concrete steps or advice that the user can follow.
3. **Relevant**: Tailor the advice to the specific topic mentioned in the query.

Do not assume or add extra information unless the user specifies it in the question. Keep the response focused on answering the specific query and keep it concise within 200 words.
"""

# Main function
def main():
    with open('data.json', 'r') as file:
        json_data = json.load(file)

    # uncomment this
    user_choice = input("Type 'text' to input text or press Enter for speech recognition: ").strip().lower()

    # user_choice = "text"
    if user_choice == "text":
        user_input = input("Please type your query: ")
    else:
        user_input = recognize_speech()

    user_id = "user_1"  # Placeholder for user identification
    user_data = next((user for user in json_data["users"] if user["user_id"] == user_id), None)

    if not user_data:
        print(f"User with ID {user_id} not found.")
        return

    while True:
        if user_choice == "text":
            user_input = input("Please type your query: ")
        else:
            user_input = recognize_speech()
        
        if not user_input:
            continue

        if any(phrase in user_input.lower() for phrase in ["exit", "bye", "quit"]):
            print("Exiting... Goodbye!")
            speak_text("Goodbye!")
            break

        prompt = common_financial_prompt(user_input, user_data)
        gemini_response = query_gemini(prompt)
        print(f"Gemini response: {gemini_response}")
        speak_text(gemini_response)

if __name__ == "__main__":
    main()
