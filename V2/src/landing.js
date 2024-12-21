import React, { useState } from 'react';
import { Mic, MicOff, ArrowRight, DollarSign, PieChart, Clock } from 'lucide-react';

const FinancialVoiceLanding = () => {
  const [isListening, setIsListening] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to handle mobile menu

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <header className="w-full">
        {/* Navbar */}
        <nav className="bg-white shadow-md w-full py-2.5">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">FinanceVoice</div>
            {/* Navbar Links */}
            <div className="hidden md:flex space-x-6">
              <button className="text-slate-600 hover:text-blue-600">Features</button>
              <button className="text-slate-600 hover:text-blue-600">Pricing</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                Get Started
              </button>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-slate-600 hover:text-blue-600">
                Menu
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
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

        <div className="pt-24 flex flex-col items-center text-center"> {/* Added pt-24 to avoid navbar overlap */}
          <h1 className="text-5xl font-bold text-slate-800 mb-6">
            Your Financial Assistant,<br />Just a Voice Command Away
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl">
            Manage your finances, check balances, and make transactions using natural voice commands. 
            Powered by advanced AI to understand your financial needs.
          </p>

          {/* Voice Input Demo */}
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl mb-12">
            <div className="flex flex-col items-center space-y-6">
              <button 
                onClick={toggleListening}
                className={`p-6 rounded-full transition-all duration-300 ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
              >
                {isListening ? <Mic size={48} /> : <MicOff size={48} />}
              </button>
              <p className="text-slate-600">
                {isListening ? "Listening... Try saying 'What's my account balance?'" : "Tap the microphone to start"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Why Choose FinanceVoice?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<DollarSign size={32} />}
              title="Easy Transactions"
              description="Make payments and transfers with simple voice commands. No more typing or clicking through menus."
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
