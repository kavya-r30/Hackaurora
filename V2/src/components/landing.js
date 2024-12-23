import React, { createContext, useContext, useState, useEffect } from 'react';
import { Mic, MicOff, ArrowRight, DollarSign, PieChart, Clock, LogOut, AlertCircle } from 'lucide-react';
import { FinancialDashboard } from './dashboard';
import { user_data } from '../data/data';

const users = user_data;
const AuthContext = createContext(null);

const LoginModal = ({ isOpen, onClose }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(userId, password)) {
      onClose();
    }
  };

  // Using opacity and scale for a fade-in zoom effect
  const modalClasses = `fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`;

  const overlayClasses = `absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${
    isOpen ? 'opacity-50' : 'opacity-0'
  }`;

  const contentClasses = `bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative transition-all duration-300 ease-in-out transform ${
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
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Login
          </button>
        </form>
      </div>
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

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
          <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => setShowDashboard(!showDashboard)}>Echo</div>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
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

      {user && showDashboard ? (
        <div className="pt-16">
          <FinancialDashboard userData={user} />
        </div>
      ) : (
        <div className="pt-24 flex flex-col items-center text-center">
          {/* All existing landing page content remains exactly the same */}
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
              <button 
                className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 flex items-center mx-auto"
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