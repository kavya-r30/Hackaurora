// landing.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Mic, MicOff, ArrowRight, DollarSign, PieChart, Clock, LogOut, AlertCircle } from 'lucide-react';
import { FinancialDashboard } from './dashboard';

// Sample user data
const users = [
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
];

// Create auth context
const AuthContext = createContext(null);

// Login form component
const LoginForm = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(userId, password);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Login to FinanceVoice</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-slate-700 mb-1">
            User ID
          </label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="mr-2" />
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const FinancialVoiceLanding = () => {
  const [isListening, setIsListening] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [showDashboard, setShowDashboard] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    checkServerStatus();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/test');
      const data = await response.json();
      setServerStatus(data.status ? 'running' : 'error');
    } catch (err) {
      setServerStatus('error');
      console.error("Server check failed:", err);
    }
  };

  const toggleListening = async () => {
    if (serverStatus !== 'running') {
      setError('Server is not running. Please start the Flask server.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch("http://127.0.0.1:5000/process-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else if (data.response) {
        setResponseMessage(data.response);
        const speech = new SpeechSynthesisUtterance(data.response);
        window.speechSynthesis.speak(speech);
      }
    } catch (err) {
      setError(`Connection error: ${err.message}`);
    } finally {
      setIsListening(false);
      setIsProcessing(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {serverStatus === 'error' && (
        <div className="fixed top-0 w-full bg-red-100 border-b border-red-200 px-4 py-3 text-red-700 z-50">
          <p className="text-center">
            Server is not running. Please start the Flask server and refresh the page.
          </p>
        </div>
      )}

      <nav className="bg-white shadow-md w-full py-2.5 fixed top-0 z-40">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">FinanceVoice</div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="text-slate-600 hover:text-blue-600"
            >
              {showDashboard ? 'Voice Assistant' : 'Dashboard'}
            </button>
            <span className="text-slate-600">Welcome, {user.Name}</span>
            <button 
              onClick={logout}
              className="flex items-center text-slate-600 hover:text-red-600"
            >
              <LogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {showDashboard ? (
        <div className="pt-16">
          <FinancialDashboard userData={user} />
        </div>
      ) : (
        <div className="pt-24 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold text-slate-800 mb-6">
            Your Financial Assistant,<br />Just a Voice Command Away
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl">
            Manage your finances, check balances, and make transactions using natural voice commands. 
            Powered by Google's Gemini AI to understand your financial needs.
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl mb-12">
            <div className="flex flex-col items-center space-y-6">
              <button 
                onClick={toggleListening}
                disabled={isProcessing}
                className={`p-6 rounded-full transition-all duration-300 ${
                  isListening ? 'bg-red-100 text-red-600 animate-pulse' : 
                  isProcessing ? 'bg-gray-100 text-gray-400' :
                  'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {isListening ? <Mic size={48} /> : <MicOff size={48} />}
              </button>

              <p className="text-slate-600">
                {isProcessing ? "Processing..." : 
                 isListening ? "Listening... Try asking about your finances" : 
                 "Tap the microphone to start"}
              </p>

              {error && (
                <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {responseMessage && (
                <div className="w-full bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                  {responseMessage}
                </div>
              )}
            </div>
          </div>

          <section className="bg-white py-20 w-full">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
                Why Choose FinanceVoice?
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard 
                  icon={<DollarSign size={32} />}
                  title="AI-Powered Advice"
                  description="Get personalized financial advice powered by Google's Gemini AI technology."
                />
                <FeatureCard 
                  icon={<PieChart size={32} />}
                  title="Smart Analytics"
                  description="Get instant insights about your spending patterns and financial health through natural conversations."
                />
                <FeatureCard 
                  icon={<Clock size={32} />}
                  title="24/7 Assistance"
                  description="Your financial assistant is always ready to help, any time of day or night."
                />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-20">
            <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Transform Your Financial Experience?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of users who have simplified their financial management with voice commands.
              </p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 flex items-center mx-auto">
                Get Started Now
                <ArrowRight className="ml-2" />
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const login = (userId, password) => {
    const userData = users.find(u => u.user_id === userId);
    
    if (userData && password === 'demo123') {
      setUser(userData);
      setError('');
      return true;
    }
    setError('Invalid credentials');
    return false;
  };

  const logout = () => {
    setUser(null);
    setError('');
  };

  return (
    <AuthContext.Provider value={{ user, error, login, logout }}>
      <FinancialVoiceLanding />
    </AuthContext.Provider>
  );
};

export default App;