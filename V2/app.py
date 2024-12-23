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
GEMINI_API_KEY = ""
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

def convert_json_to_text(user_data):
    """Convert user data to text format for the Gemini prompt."""
    if(user_data == None): 
        return None

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

def common_financial_prompt(user_query, user_data):
    """Generate the financial advisor prompt with user details."""
    user_details = convert_json_to_text(user_data)
    return f"""
    You are a friendly caring financial advisor. A user has the following financial question:
    
    User's Details: {user_details}
    
    User's Question: {user_query}
    
    Please provide clear and actionable advice based on the user's query. The topics can include but are not limited to:
    - Budgeting and expense management
    - Loan options (e.g., home, car, personal loans)
    - Investment strategies (e.g., stocks, bonds, retirement savings)
    - Credit card recommendations
    - Savings plans (e.g., emergency fund, retirement savings)
    - Financial goal setting and planning
    - Friendly chat
    
    Your response should be:
    1. **Clear**: Make sure your response is easy to understand.
    2. **Actionable**: Offer concrete steps or advice that the user can follow.
    3. **Relevant**: Tailor the advice to the specific topic mentioned in the query.
    
    Do not assume or add extra information unless the user specifies it in the question. 
    Keep the response focused on answering the specific query and keep it concise within 50-75 words.
    """

def query_gemini(input_text, user_data):
    """Call Gemini API with the formatted prompt."""
    headers = {"Content-Type": "application/json"}
    prompt = common_financial_prompt(input_text, user_data)
    
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
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
        engine = pyttsx3.init()
        engine.say(text)
        engine.runAndWait()

    thread = Thread(target=run_tts)
    thread.start()

def load_user_data(user_id):
    """Load user data from JSON file."""
    try:
        # with open('data.json', 'r') as file:
        json_data = {
    "users": [
        {
            "user_id": "user_1",
            "Name": "John Doe",
            "financial_data": {
                "income": {
                    "salary": 5000,
                    "freelance": 1200,
                    "other": 300
                },
                "expenses": {
                    "rent": 1200,
                    "utilities": 300,
                    "groceries": 500,
                    "entertainment": 200,
                    "transportation": 150,
                    "other": 100
                },
                "savings": {
                    "emergency_fund": 10000,
                    "retirement_fund": 25000,
                    "other": 5000
                },
                "investments": {
                    "stocks": 15000,
                    "bonds": 8000,
                    "real_estate": 50000,
                    "mutual_funds": 12000,
                    "cryptocurrency": 3000
                },
                "transactions": [
                    {
                        "date": "2024-12-20",
                        "description": "Grocery shopping",
                        "amount": 100,
                        "type": "expense"
                    },
                    {
                        "date": "2024-12-19",
                        "description": "Salary credited",
                        "amount": 5000,
                        "type": "income"
                    },
                    {
                        "date": "2024-12-18",
                        "description": "Electricity bill",
                        "amount": 150,
                        "type": "expense"
                    }
                ],
                "loans": {
                    "home_loan": {
                        "principal": 200000,
                        "interest_rate": 3.5,
                        "monthly_payment": 1200,
                        "remaining_balance": 180000
                    },
                    "car_loan": {
                        "principal": 25000,
                        "interest_rate": 5.0,
                        "monthly_payment": 400,
                        "remaining_balance": 20000
                    }
                }
            }
        },
        {
            "user_id": "user_2",
            "Name": "Jane Smith",
            "financial_data": {
                "income": {
                    "salary": 6000,
                    "rental_income": 2000,
                    "other": 500
                },
                "expenses": {
                    "mortgage": 1500,
                    "childcare": 800,
                    "utilities": 350,
                    "groceries": 600,
                    "insurance": 200,
                    "other": 150
                },
                "savings": {
                    "emergency_fund": 15000,
                    "education_fund": 10000,
                    "vacation_fund": 3000
                },
                "investments": {
                    "stocks": 20000,
                    "bonds": 10000,
                    "real_estate": 70000,
                    "mutual_funds": 15000,
                    "gold": 5000
                },
                "transactions": [
                    {
                        "date": "2024-12-21",
                        "description": "Childcare payment",
                        "amount": 800,
                        "type": "expense"
                    },
                    {
                        "date": "2024-12-20",
                        "description": "Rental income",
                        "amount": 2000,
                        "type": "income"
                    },
                    {
                        "date": "2024-12-19",
                        "description": "Insurance premium",
                        "amount": 200,
                        "type": "expense"
                    }
                ],
                "loans": {
                    "student_loan": {
                        "principal": 40000,
                        "interest_rate": 4.0,
                        "monthly_payment": 500,
                        "remaining_balance": 35000
                    }
                }
            }
        },
        {
            "user_id": "user_3",
            "Name": "Mark Johnson",
            "financial_data": {
                "income": {
                    "salary": 7000,
                    "freelance": 1500,
                    "other": 400
                },
                "expenses": {
                    "mortgage": 1800,
                    "utilities": 250,
                    "groceries": 700,
                    "entertainment": 300,
                    "transportation": 200,
                    "other": 120
                },
                "savings": {
                    "emergency_fund": 12000,
                    "retirement_fund": 18000,
                    "vacation_fund": 3500
                },
                "investments": {
                    "stocks": 25000,
                    "bonds": 15000,
                    "real_estate": 35000,
                    "mutual_funds": 10000,
                    "cryptocurrency": 5000
                },
                "transactions": [
                    {
                        "date": "2024-12-20",
                        "description": "Freelance project payment",
                        "amount": 1500,
                        "type": "income"
                    },
                    {
                        "date": "2024-12-18",
                        "description": "Mortgage payment",
                        "amount": 1800,
                        "type": "expense"
                    },
                    {
                        "date": "2024-12-17",
                        "description": "Electricity bill",
                        "amount": 250,
                        "type": "expense"
                    }
                ],
                "loans": {
                    "home_loan": {
                        "principal": 250000,
                        "interest_rate": 3.5,
                        "monthly_payment": 1800,
                        "remaining_balance": 220000
                    }
                }
            }
        },
        {
            "user_id": "user_4",
            "Name": "Emily Brown",
            "financial_data": {
                "income": {
                    "salary": 5500,
                    "other": 600
                },
                "expenses": {
                    "rent": 1000,
                    "utilities": 250,
                    "groceries": 400,
                    "entertainment": 150,
                    "transportation": 120,
                    "other": 100
                },
                "savings": {
                    "emergency_fund": 8000,
                    "retirement_fund": 20000,
                    "other": 2000
                },
                "investments": {
                    "stocks": 18000,
                    "bonds": 9000,
                    "real_estate": 45000,
                    "mutual_funds": 13000,
                    "cryptocurrency": 2000
                },
                "transactions": [
                    {
                        "date": "2024-12-22",
                        "description": "Salary credited",
                        "amount": 5500,
                        "type": "income"
                    },
                    {
                        "date": "2024-12-20",
                        "description": "Grocery shopping",
                        "amount": 200,
                        "type": "expense"
                    },
                    {
                        "date": "2024-12-19",
                        "description": "Transportation cost",
                        "amount": 120,
                        "type": "expense"
                    }
                ],
                "loans": {
                    "car_loan": {
                        "principal": 30000,
                        "interest_rate": 4.5,
                        "monthly_payment": 500,
                        "remaining_balance": 25000
                    }
                }
            }
        },
        {
            "user_id": "user_5",
            "Name": "Michael Green",
            "financial_data": {
                "income": {
                    "salary": 8000,
                    "other": 700
                },
                "expenses": {
                    "mortgage": 2000,
                    "utilities": 400,
                    "groceries": 800,
                    "entertainment": 250,
                    "transportation": 180,
                    "other": 150
                },
                "savings": {
                    "emergency_fund": 20000,
                    "education_fund": 12000,
                    "vacation_fund": 5000
                },
                "investments": {
                    "stocks": 30000,
                    "bonds": 12000,
                    "real_estate": 60000,
                    "mutual_funds": 18000,
                    "gold": 7000
                },
                "transactions": [
                    {
                        "date": "2024-12-20",
                        "description": "Salary credited",
                        "amount": 8000,
                        "type": "income"
                    },
                    {
                        "date": "2024-12-19",
                        "description": "Mortgage payment",
                        "amount": 2000,
                        "type": "expense"
                    },
                    {
                        "date": "2024-12-18",
                        "description": "Electricity bill",
                        "amount": 400,
                        "type": "expense"
                    }
                ],
                "loans": {
                    "home_loan": {
                        "principal": 350000,
                        "interest_rate": 3.2,
                        "monthly_payment": 2500,
                        "remaining_balance": 320000
                    }
                }
            }
        },
        {
            "user_id": "user_6",
            "Name": "Olivia White",
            "financial_data": {
                "income": {
                    "salary": 7500,
                    "other": 800
                },
                "expenses": {
                    "rent": 1500,
                    "utilities": 300,
                    "groceries": 600,
                    "entertainment": 150,
                    "transportation": 100,
                    "other": 90
                },
                "savings": {
                    "emergency_fund": 11000,
                    "retirement_fund": 23000,
                    "other": 4500
                },
                "investments": {
                    "stocks": 23000,
                    "bonds": 12000,
                    "real_estate": 40000,
                    "mutual_funds": 10000,
                    "cryptocurrency": 4000
                },
                "transactions": [
                    {
                        "date": "2024-12-21",
                        "description": "Freelance payment",
                        "amount": 800,
                        "type": "income"
                    },
                    {
                        "date": "2024-12-20",
                        "description": "Rent payment",
                        "amount": 1500,
                        "type": "expense"
                    },
                    {
                        "date": "2024-12-19",
                        "description": "Utility payment",
                        "amount": 300,
                        "type": "expense"
                    }
                ],
                "loans": {
                    "student_loan": {
                        "principal": 25000,
                        "interest_rate": 4.5,
                        "monthly_payment": 350,
                        "remaining_balance": 20000
                    }
                }
            }
        },
        {
            "user_id": "user_7",
            "Name": "Lucas Turner",
            "financial_data": {
                "income": {
                    "salary": 5200,
                    "other": 400
                },
                "expenses": {
                    "rent": 1100,
                    "utilities": 250,
                    "groceries": 400,
                    "entertainment": 100,
                    "transportation": 80,
                    "other": 120
                },
                "savings": {
                    "emergency_fund": 8000,
                    "retirement_fund": 15000,
                    "vacation_fund": 4000
                },
                "investments": {
                    "stocks": 18000,
                    "bonds": 12000,
                    "real_estate": 30000,
                    "mutual_funds": 9000,
                    "cryptocurrency": 2500
                },
                "transactions": [
                    {
                        "date": "2024-12-22",
                        "description": "Salary credited",
                        "amount": 5200,
                        "type": "income"
                    },
                    {
                        "date": "2024-12-20",
                        "description": "Rent payment",
                        "amount": 1100,
                        "type": "expense"
                    },
                    {
                        "date": "2024-12-19",
                        "description": "Grocery shopping",
                        "amount": 150,
                        "type": "expense"
                    }
                ],
                "loans": {
                    "student_loan": {
                        "principal": 20000,
                        "interest_rate": 5.0,
                        "monthly_payment": 400,
                        "remaining_balance": 15000
                    }
                }
            }
        },
        {
            "user_id": "user_8",
            "Name": "Megan Lee",
            "financial_data": {
                "income": {
                    "salary": 5800,
                    "freelance": 1200,
                    "other": 600
                },
                "expenses": {
                    "rent": 1300,
                    "utilities": 320,
                    "groceries": 500,
                    "entertainment": 180,
                    "transportation": 200,
                    "other": 150
                },
                "savings": {
                    "emergency_fund": 12000,
                    "retirement_fund": 22000,
                    "vacation_fund": 5000
                },
                "investments": {
                    "stocks": 22000,
                    "bonds": 15000,
                    "real_estate": 50000,
                    "mutual_funds": 12000,
                    "cryptocurrency": 6000
                },
                "transactions": [
                    {
                        "date": "2024-12-20",
                        "description": "Freelance payment",
                        "amount": 1200,
                        "type": "income"
                    },
                    {
                        "date": "2024-12-19",
                        "description": "Rent payment",
                        "amount": 1300,
                        "type": "expense"
                    },
                    {
                        "date": "2024-12-18",
                        "description": "Utility payment",
                        "amount": 320,
                        "type": "expense"
                    }
                ],
                "loans": {
                    "car_loan": {
                        "principal": 20000,
                        "interest_rate": 4.0,
                        "monthly_payment": 300,
                        "remaining_balance": 15000
                    }
                }
            }
        }
    ]
}

        return next((user for user in json_data["users"] if user["user_id"] == user_id), None)
    except Exception as e:
        print(f"Error loading user data: {str(e)}")
        return None

@app.route('/process-query', methods=['POST'])
def process_query():
    """Handle voice queries and return Gemini responses with user context."""
    try:
        data = request.get_json()  
        user_id = data.get('user_id')
        user_data = load_user_data(user_id)
        if not user_data:
            # return jsonify({"error": "User data not found", "status": "error"}), 404
            print(f"Please login with your user with ID {user_id} to access your financial data.")

        print("Starting speech recognition...")
        
        with sr.Microphone() as source:
            print("Adjusting for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            
            print("Listening for speech...")
            try:
                audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
                print("Recognizing speech...")
                text = recognizer.recognize_google(audio)
                print(f"Recognized text: {text}")
                
                # Query Gemini with the recognized text and user data
                gemini_response = query_gemini(text, user_data)
                print(f"Gemini response: {gemini_response}")
                
                # Speak the response
                # speak_text(gemini_response)
                
                return jsonify({
                    "response": gemini_response,
                    "status": "success",
                    "recognized_text": text
                })
                
            except sr.WaitTimeoutError:
                print("No speech detected status: error 400")
                return jsonify({"error": "No speech detected", "status": "error"}), 400
            except sr.UnknownValueError:
                print("Could not understand audio status: error 400")
                return jsonify({"error": "Could not understand audio", "status": "error"}), 400
            except sr.RequestError as e:
                print(f"Speech recognition error: {str(e)}: status: error 500")
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