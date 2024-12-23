import '../App.css';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Mic, MicOff, ArrowRight, DollarSign, PieChart, Clock, LogOut, AlertCircle, 
  TrendingUp, Shield, Wallet, Users, CreditCard, Newspaper, Gift, ChevronRight, } from 'lucide-react';
import { FinancialDashboard } from './dashboard';
import { user_data } from '../data/data';

const users = user_data;
const AuthContext = createContext(null);

const newsData = [
  {
    title: "Federal Reserve Announces New Interest Rate Policy",
    summary: "The Federal Reserve has announced changes to its interest rate policy, signaling a shift in monetary strategy for 2024. The changes are expected to impact mortgage rates and consumer lending.",
    date: "Dec 23, 2024",
    source: "Financial Times",
    link: "https://ft.com"
  },
  {
    title: "Global Markets Show Strong Recovery Signs",
    summary: "Major global markets are showing significant recovery signs, with tech and renewable energy sectors leading the growth. Asian markets particularly strong.",
    date: "Dec 22, 2024",
    source: "Bloomberg",
    link: "https://bloomberg.com"
  },
  {
    title: "New Digital Banking Trends for 2024",
    summary: "Analysis of emerging digital banking trends including AI integration, blockchain adoption, and improved security measures. Mobile banking sees significant growth.",
    date: "Dec 21, 2024",
    source: "Reuters",
    link: "https://reuters.com"
  }
];

const NewsCard = ({ news, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
    <div className="bg-white p-6 rounded-xl max-w-lg w-full mx-4 transform transition-all duration-300 scale-100">
      <h3 className="text-xl font-bold mb-4">{news.title}</h3>
      <p className="text-slate-600 mb-4">{news.summary}</p>
      <div className="flex justify-between text-sm text-slate-500 mb-4">
        <span>{news.date}</span>
        <span>{news.source}</span>
      </div>
      <div className="flex space-x-4">
        <a 
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          Read More
        </a>
        <button
          onClick={onClose}
          className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const QuickActionModal = ({ action, onClose, userData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const getActionContent = () => {
    if (!userData) {
      return {
        title: "Login Required",
        content: "Please login to access this feature",
        icon: <AlertCircle className="text-blue-600 mb-4" size={32} />
      };
    }

    switch (action) {
      case 'balance':
        const totalBalance = Object.values(userData.financial_data.savings).reduce((a, b) => a + b, 0);
        return {
          title: "Account Balance",
          content: `Current Balance: $${totalBalance.toLocaleString()}`,
          icon: <Wallet className="text-blue-600 mb-4" size={32} />
        };
      case 'transactions':
        const recentTransactions = userData.financial_data.transactions.slice(0, 3);
        return {
          title: "Recent Transactions",
          content: (
            <div className="space-y-2">
              {recentTransactions.map((t, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-600">{t.description}</span>
                  <span className={t.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    ${t.amount}
                  </span>
                </div>
              ))}
            </div>
          ),
          icon: <CreditCard className="text-blue-600 mb-4" size={32} />
        };
      case 'investment':
        const totalInvestments = Object.values(userData.financial_data.investments).reduce((a, b) => a + b, 0);
        return {
          title: "Investment Overview",
          content: (
            <div className="space-y-2">
              <p className="text-slate-600">Total Portfolio: ${totalInvestments.toLocaleString()}</p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Quick Tips:</h4>
                <ul className="list-disc list-inside text-sm text-slate-600">
                  <li>Diversify your portfolio</li>
                  <li>Regular investment review</li>
                  <li>Consider long-term growth</li>
                </ul>
              </div>
            </div>
          ),
          icon: <TrendingUp className="text-blue-600 mb-4" size={32} />
        };
      case 'rewards':
        return {
          title: "Your Rewards",
          content: (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-medium">Current Points: 1,234</p>
                <p className="text-sm text-slate-600">Worth approximately $123.40</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Available Rewards:</h4>
                <ul className="text-sm text-slate-600">
                  <li>• $50 Amazon Gift Card (500 points)</li>
                  <li>• $100 Cash Back (1000 points)</li>
                  <li>• Travel Miles (1500 points)</li>
                </ul>
              </div>
            </div>
          ),
          icon: <Gift className="text-blue-600 mb-4" size={32} />
        };
      default:
        return {
          title: "Feature",
          content: "Content unavailable",
          icon: <AlertCircle className="text-blue-600 mb-4" size={32} />
        };
    }
  };

  const actionContent = getActionContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 transform transition-all duration-300">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        ) : (
          <div className="text-center">
            {actionContent.icon}
            <h3 className="text-xl font-bold mb-4">{actionContent.title}</h3>
            <div className="text-slate-600 mb-6">{actionContent.content}</div>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="text-blue-600 mb-4">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const TestimonialCard = ({ name, role, content, avatar }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
        {name.charAt(0)}
      </div>
      <div className="ml-4">
        <h4 className="font-semibold text-slate-800">{name}</h4>
        <p className="text-sm text-slate-600">{role}</p>
      </div>
    </div>
    <p className="text-slate-700 italic">{content}</p>
  </div>
);

const QuickActionButton = ({ icon: Icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
  >
    <div className="text-blue-600 mb-2">
      <Icon size={24} />
    </div>
    <span className="text-sm text-slate-700">{label}</span>
  </button>
);

const LoginModal = ({ isOpen, onClose }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (login(userId, password)) {
      onClose();
    }
    setIsLoading(false);
  };

  const modalClasses = `fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`;

  const overlayClasses = `absolute inset-0 bg-black transition-opacity duration-300 ${
    isOpen ? 'opacity-50' : 'opacity-0'
  }`;

  const contentClasses = `bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative transition-all duration-300 transform ${
    isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
  }`;

  return (
    <div className={modalClasses}>
      <div className={overlayClasses} onClick={onClose}></div>
      <div className={contentClasses}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          ×
        </button>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Welcome Back</h2>
        
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
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Enter your user ID (user_1)"
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
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Enter your password (demo123)"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
              <AlertCircle className="mr-2" size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium relative"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const FinancialVoiceLanding = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
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
          user_id: user?.user_id,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {serverStatus === 'error' && (
        <div className="fixed top-0 w-full bg-red-100 border-b border-red-200 px-4 py-3 text-red-700 z-50 animate-fade-in-down">
          <p className="text-center">
            Server is not running. Please start the Flask server and refresh the page.
          </p>
        </div>
      )}

      <nav className="bg-white shadow-md w-full py-2.5 fixed top-0 z-40">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors" 
               onClick={() => setShowDashboard(!showDashboard)}>
            FinanceVoice
          </div>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <button
                  onClick={() => setShowDashboard(!showDashboard)}
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {showDashboard ? 'Voice Assistant' : 'Dashboard'}
                </button>
                <span className="text-slate-600">Welcome, {user.Name}</span>
                <button 
                  onClick={logout}
                  className="flex items-center text-slate-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {selectedNews && (
        <NewsCard
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}

      {selectedAction && (
        <QuickActionModal
          action={selectedAction}
          onClose={() => setSelectedAction(null)}
          userData={user}
        />
      )}

      {user && showDashboard ? (
        <div className="pt-16">
          <FinancialDashboard userData={user} />
        </div>
      ) : (
        <div className="pt-24 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold text-slate-800 mb-6 animate-fade-in">
            Your Financial Assistant,<br />Just a Voice Command Away
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl animate-fade-in-up">
            Manage your finances, check balances, and make transactions using natural voice commands.
            Powered by Google's Gemini AI to understand your financial needs.
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl mb-12 hover:shadow-lg transition-all duration-300 animate-fade-in-up">
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
                <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded animate-fade-in">
                  {error}
                </div>
              )}
              {responseMessage && (
                <div className="w-full bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded animate-fade-in">
                  {responseMessage}
                </div>
              )}
            </div>
          </div>

          <div className="container mx-auto px-4 mb-12 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickActionButton icon={Wallet} label="Check Balance" 
                onClick={() => setSelectedAction('balance')} />
              <QuickActionButton icon={CreditCard} label="Recent Transactions" 
                onClick={() => setSelectedAction('transactions')} />
              <QuickActionButton icon={TrendingUp} label="Investment Tips" 
                onClick={() => setSelectedAction('investment')} />
              <QuickActionButton icon={Gift} label="Rewards" 
                onClick={() => setSelectedAction('rewards')} />
            </div>
          </div>

          <section className="container mx-auto px-4 mb-12">
            <div className="bg-white rounded-2xl p-8 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Latest Financial News</h2>
              <div className="space-y-4">
                {newsData.map((news, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedNews(news)}
                    className="flex items-center justify-between bg-blue-50 p-4 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  >
                    <span className="text-slate-700">{news.title}</span>
                    <ChevronRight className="text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white pt-12 pb-20 w-full">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
                Why Choose FinanceVoice?
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={DollarSign}
                  title="AI-Powered Advice"
                  description="Get personalized financial advice powered by Google's Gemini AI technology."
                />
                <FeatureCard
                  icon={PieChart}
                  title="Smart Analytics"
                  description="Get instant insights about your spending patterns and financial health through natural conversations."
                />
                <FeatureCard
                  icon={Clock}
                  title="24/7 Assistance"
                  description="Your financial assistant is always ready to help, any time of day or night."
                />
              </div>
            </div>
          </section>

          <section className="pt-12">
            <div className="container mx-auto px-4 mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">What Our Users Say</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <TestimonialCard
                  name="Sarah Johnson"
                  role="Small Business Owner"
                  content="The voice commands have made managing my business finances incredibly efficient. It's like having a personal CFO!"
                />
                <TestimonialCard
                  name="Michael Chen"
                  role="Investment Analyst"
                  content="The AI-powered insights have helped me make better investment decisions. The real-time market analysis is impressive."
                />
                <TestimonialCard
                  name="Emma Davis"
                  role="Freelancer"
                  content="Finally, a financial app that understands my irregular income patterns and helps me plan accordingly."
                />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 mb-12">
            <div className="bg-blue-600 rounded-2xl p-8 text-white hover:shadow-xl transition-all duration-500 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Bank-Grade Security</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-4">
                  <Shield className="flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
                    <p className="opacity-80">Your data is protected with military-grade encryption</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Users className="flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
                    <p className="opacity-80">Extra layer of security for your account</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Newspaper className="flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Regular Audits</h3>
                    <p className="opacity-80">Continuous security monitoring and updates</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 pb-20">
            <div className="bg-blue-600 rounded-2xl p-12 text-center text-white hover:shadow-xl transition-all duration-500 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Transform Your Financial Experience?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of users who have simplified their financial management with voice commands.
              </p>
              <button 
                className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors flex items-center mx-auto"
                onClick={user ? () => setShowDashboard(true) : () => setIsLoginModalOpen(true)}
              >
                {user ? 'Go to Dashboard' : 'Login to Get Started'}
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