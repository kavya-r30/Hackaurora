import React, { useState, useEffect } from 'react';
import { Mic, MicOff, ArrowRight, DollarSign, PieChart, Clock } from 'lucide-react';

const FinancialVoiceLanding = () => {
  const [isListening, setIsListening] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    checkServerStatus();
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
      console.log("Starting speech recognition...");
      const response = await fetch("http://127.0.0.1:5000/process-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "user_1",
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Processed data:", data);

      if (data.error) {
        setError(data.error);
      } else if (data.response) {
        setResponseMessage(data.response);
        const speech = new SpeechSynthesisUtterance(data.response);
        window.speechSynthesis.speak(speech);
      }
    } catch (err) {
      console.error("Error details:", err);
      setError(`Connection error: ${err.message}`);
    } finally {
      setIsListening(false);
      setIsProcessing(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Server Status Alert */}
      {serverStatus === 'error' && (
        <div className="fixed top-0 w-full bg-red-100 border-b border-red-200 px-4 py-3 text-red-700 z-50">
          <p className="text-center">
            Server is not running. Please start the Flask server and refresh the page.
          </p>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white shadow-md w-full py-2.5 fixed top-0 z-40">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">FinanceVoice</div>
          <div className="hidden md:flex space-x-6">
            <button className="text-slate-600 hover:text-blue-600">Features</button>
            <button className="text-slate-600 hover:text-blue-600">Pricing</button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
              Get Started
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-slate-600 hover:text-blue-600">
              Menu
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md w-full absolute top-14 left-0 py-4 px-4">
            <button className="block text-slate-600 hover:text-blue-600 w-full text-center py-2">Features</button>
            <button className="block text-slate-600 hover:text-blue-600 w-full text-center py-2">Pricing</button>
            <button className="block bg-blue-600 text-white w-full text-center py-2 rounded-full hover:bg-blue-700">
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="pt-24 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold text-slate-800 mb-6">
          Your Financial Assistant,<br />Just a Voice Command Away
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl">
          Manage your finances, check balances, and make transactions using natural voice commands. 
          Powered by Google's Gemini AI to understand your financial needs.
        </p>

        {/* Voice Input Demo */}
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
      </div>

      {/* Features Section */}
      <section className="bg-white py-20">
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

      {/* CTA Section */}
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
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </section>
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

export default FinancialVoiceLanding;