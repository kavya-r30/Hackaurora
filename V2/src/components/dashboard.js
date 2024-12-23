import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, CreditCard, PieChart as PieChartIcon, Activity, DollarSign } from 'lucide-react';

export const FinancialDashboard = ({ userData }) => {
  const [timeRange, setTimeRange] = useState('monthly');

  // Process income data for pie chart
  const incomeData = Object.entries(userData.financial_data.income).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Process expenses data for pie chart
  const expenseData = Object.entries(userData.financial_data.expenses).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Process investments data for pie chart
  const investmentData = Object.entries(userData.financial_data.investments).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Calculate total values
  const totalIncome = Object.values(userData.financial_data.income).reduce((a, b) => a + b, 0);
  const totalExpenses = Object.values(userData.financial_data.expenses).reduce((a, b) => a + b, 0);
  const totalInvestments = Object.values(userData.financial_data.investments).reduce((a, b) => a + b, 0);
  const totalSavings = Object.values(userData.financial_data.savings).reduce((a, b) => a + b, 0);

  // Process transactions for line chart
  const transactionData = userData.financial_data.transactions.map(t => ({
    date: t.date,
    amount: t.amount,
    type: t.type
  })).reverse();

  const StatCard = ({ title, value, icon, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-slate-500 text-sm font-medium">{title}</div>
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-slate-800">${value.toLocaleString()}</div>
      <div className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Financial Dashboard</h1>
          <p className="text-slate-500">Welcome back, {userData.Name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Income" 
            value={totalIncome} 
            icon={<Wallet size={20} />}
            trend={8.2}
          />
          <StatCard 
            title="Total Expenses" 
            value={totalExpenses} 
            icon={<CreditCard size={20} />}
            trend={-2.4}
          />
          <StatCard 
            title="Total Investments" 
            value={totalInvestments} 
            icon={<TrendingUp size={20} />}
            trend={12.5}
          />
          <StatCard 
            title="Total Savings" 
            value={totalSavings} 
            icon={<DollarSign size={20} />}
            trend={5.7}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income vs Expenses Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Income vs Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="amount" name="Amount" stroke="#3B82F6" fill="#93C5FD" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Investment Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Investment Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={investmentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#3B82F6"
                  label
                >
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Income Breakdown */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Income Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Categories */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Expense Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#F87171"
                  label
                >
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Description</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {userData.financial_data.transactions.map((transaction, index) => (
                  <tr key={index} className="border-t border-slate-100">
                    <td className="py-4">{transaction.date}</td>
                    <td className="py-4">{transaction.description}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`py-4 ${
                      transaction.type === 'income' 
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      ${transaction.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example usage of the dashboard
const DashboardApp = () => {
  // Sample user data from your JSON
  const sampleUser = {
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
      ]
    }
  };

  return <FinancialDashboard userData={sampleUser} />;
};

export default DashboardApp;