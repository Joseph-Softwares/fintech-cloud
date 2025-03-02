import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Simulated sessionStorage for React environment
const sessionStorage = {
  _data: {},
  setItem: function(id, val) { this._data[id] = val; },
  getItem: function(id) { return this._data[id] || null; },
  removeItem: function(id) { delete this._data[id]; },
  clear: function() { this._data = {}; }
};

const App = () => {
  // Mock spending data by category for charts
  const spendingByCategory = [
    { category: "Food", amount: 347.30, color: "#FF6384", percentage: 28 },
    { category: "Shopping", amount: 228.99, color: "#36A2EB", percentage: 18 },
    { category: "Utilities", amount: 187.45, color: "#FFCE56", percentage: 15 },
    { category: "Transportation", amount: 138.50, color: "#4BC0C0", percentage: 11 },
    { category: "Entertainment", amount: 114.99, color: "#9966FF", percentage: 9 },
    { category: "Transfers", amount: 230.00, color: "#FF9F40", percentage: 19 }
  ];
  
  // Mock monthly spending trends
  const monthlyTrends = [
    { month: "Jan", spending: 1100, income: 3200 },
    { month: "Feb", spending: 1250, income: 3200 },
    { month: "Mar", spending: 1246, income: 3200 },
    { month: "Apr", spending: 1300, income: 3200, isForecast: true }, // Forecast
    { month: "May", spending: 1280, income: 3250, isForecast: true }, // Forecast
    { month: "Jun", spending: 1260, income: 3250, isForecast: true }  // Forecast
  ];
  
  // Mock savings recommendations
  const savingsRecommendations = [
    { 
      id: 1, 
      title: "Reduce coffee expenses", 
      description: "You spent $87 on coffee this month. Consider brewing at home to save ~$52/month.", 
      potential: 52,
      category: "food"
    },
    { 
      id: 2, 
      title: "Entertainment subscriptions", 
      description: "You have 4 active subscriptions totaling $45/month. Consider reviewing unused ones.", 
      potential: 30,
      category: "entertainment"
    },
    { 
      id: 3, 
      title: "Grocery shopping strategy", 
      description: "Shopping mid-week could save you approximately 12% on groceries.", 
      potential: 28,
      category: "groceries"
    }
  ];
  
  // Mock anomalies
  const anomalies = [
    {
      id: 1,
      transaction: { 
        name: "Online Store", 
        date: "Mar 12", 
        amount: -128.99,
        category: "shopping"
      },
      reason: "Unusual merchant and 85% higher than your typical shopping transactions"
    }
  ];
  
  // Mock cash flow predictions 
  const cashFlowPrediction = {
    currentBalance: 2458.50,
    endOfMonthPrediction: 2115.75,
    nextMonth: 3850.25,
    upcomingExpenses: [
      { name: "Rent", amount: 1200, date: "Apr 1", certainty: "high" },
      { name: "Phone Bill", amount: 85, date: "Apr 5", certainty: "high" },
      { name: "Car Insurance", amount: 112, date: "Apr 15", certainty: "high" }
    ],
    anticipatedIncome: [
      { name: "Salary", amount: 3200, date: "Apr 1", certainty: "high" }
    ]
  };
  
  // Exchange rates data
  const exchangeRates = {
    USD: 1.00,
    INR: 83.12,
    EUR: 0.92,
    GBP: 0.79,
    CAD: 1.36,
    AUD: 1.53,
    JPY: 150.43,
    CNY: 7.22,
    SGD: 1.35,
    AED: 3.67
  };
  
  // Blockchain IDs for security (masked for privacy)
  const blockchainId = {
    id: "xR7b2...8fT9",
    type: "private",
    lastVerified: "2025-02-28T14:30:00",
    securityLevel: "high",
    isActive: true
  };
  
  // Funding sources
  const fundingSources = [
    { id: 1, type: "bank", name: "Chase Checking", accountNumber: "****4567", isDefault: true, currency: "USD" },
    { id: 2, type: "bank", name: "Citi Savings", accountNumber: "****8901", isDefault: false, currency: "USD" },
    { id: 3, type: "card", name: "Amex Gold", accountNumber: "****3456", isDefault: false, currency: "USD" },
    { id: 4, type: "international", name: "HSBC UK", accountNumber: "****7890", isDefault: false, currency: "GBP" }
  ];
  
  // Wallet balances in different currencies
  const walletBalances = [
    { currency: "USD", balance: 2458.50, symbol: "$" },
    { currency: "INR", balance: 12500.00, symbol: "₹" },
    { currency: "EUR", balance: 350.75, symbol: "€" }
  ];
  
  // App state
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [balance, setBalance] = useState(2458.5);
  const [amount, setAmount] = useState("100.00");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [sessionTime, setSessionTime] = useState(0);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricType, setBiometricType] = useState("fingerprint"); // fingerprint or face
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [selectedInsightTab, setSelectedInsightTab] = useState("spending");
  const [showAnomalyAlert, setShowAnomalyAlert] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [budget, setBudget] = useState({
    food: 350,
    shopping: 250,
    utilities: 200,
    transportation: 150,
    entertainment: 120,
    transfers: 250
  });
  const [selectedContactTab, setSelectedContactTab] = useState("recent");
  const [selectedBudgetPeriod, setSelectedBudgetPeriod] = useState("monthly");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [recipientCurrency, setRecipientCurrency] = useState("USD");
  const [selectedFundingSource, setSelectedFundingSource] = useState(fundingSources[0]);
  const [activeWalletCurrency, setActiveWalletCurrency] = useState("USD");
  const [showBlockchainVerification, setShowBlockchainVerification] = useState(false);
  
  // Track session time
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format session time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(sessionTime / 60);
    const seconds = sessionTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Navigation function with biometric authentication for sensitive screens
  const navigateTo = (screen) => {
    const sensitiveScreens = ["sendMoney", "profile", "transactions"];
    
    if (isBiometricEnabled && sensitiveScreens.includes(screen) && currentScreen !== "biometricAuth") {
      // Store target screen and redirect to biometric authentication
      sessionStorage.setItem("targetScreen", screen);
      setCurrentScreen("biometricAuth");
    } else {
      setCurrentScreen(screen);
    }
  };
  
  // Authenticate with biometrics and proceed to target screen
  const authenticateWithBiometrics = () => {
    setIsAuthenticating(true);
    
    // Simulate biometric authentication process
    setTimeout(() => {
      setIsAuthenticating(false);
      const targetScreen = sessionStorage.getItem("targetScreen") || "dashboard";
      setCurrentScreen(targetScreen);
      showToastMessage("Biometric authentication successful");
    }, 1500);
  };
  
  // Show toast message
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  
  // Calculate exchange amount
  const calculateExchangeAmount = (sourceAmount, sourceCurrency, targetCurrency) => {
    if (sourceCurrency === targetCurrency) return sourceAmount;
    const sourceRate = exchangeRates[sourceCurrency];
    const targetRate = exchangeRates[targetCurrency];
    return (sourceAmount * targetRate) / sourceRate;
  };
  
  // Send money function with currency exchange
  const sendMoney = () => {
    if (amount && !isNaN(parseFloat(amount))) {
      const amountValue = parseFloat(amount);
      
      // Deduct from sender's wallet in selected currency
      if (selectedCurrency === activeWalletCurrency) {
        setBalance(prev => prev - amountValue);
      } else {
        // Would handle multi-currency wallet updates here
        setBalance(prev => prev - (amountValue / exchangeRates[selectedCurrency]));
      }
      
      // Generate blockchain verification
      setShowBlockchainVerification(true);
      setTimeout(() => {
        setShowBlockchainVerification(false);
        
        // Format success message based on currencies
        const recipientAmount = calculateExchangeAmount(amountValue, selectedCurrency, recipientCurrency);
        const sourceCurrencySymbol = selectedCurrency === "USD" ? "$" : 
          selectedCurrency === "INR" ? "₹" : 
          selectedCurrency === "EUR" ? "€" : 
          selectedCurrency === "GBP" ? "£" : selectedCurrency;
        const targetCurrencySymbol = recipientCurrency === "USD" ? "$" : 
          recipientCurrency === "INR" ? "₹" : 
          recipientCurrency === "EUR" ? "€" : 
          recipientCurrency === "GBP" ? "£" : recipientCurrency;
        
        if (selectedCurrency === recipientCurrency) {
          showToastMessage(`${sourceCurrencySymbol}${amount} sent successfully!`);
        } else {
          showToastMessage(`${sourceCurrencySymbol}${amount} (${targetCurrencySymbol}${recipientAmount.toFixed(2)}) sent successfully!`);
        }
        
        setTimeout(() => navigateTo("paymentSuccess"), 1000);
      }, 2000);
    }
  };
  
  // Sample transaction data with categories and expanded information
  const transactions = [
    { 
      id: 1, 
      name: "Shivanand Kumar", 
      date: "Today", 
      amount: -100.00,
      category: "transfer",
      description: "Payment to friend",
      location: "Mobile App"
    },
    { 
      id: 2, 
      name: "Coffee Shop", 
      date: "Today", 
      amount: -4.50,
      category: "food",
      description: "Morning coffee",
      location: "Downtown"
    },
    { 
      id: 3, 
      name: "John Smith", 
      date: "Yesterday", 
      amount: 25.00,
      category: "transfer",
      description: "Split dinner bill",
      location: "Mobile App"
    },
    { 
      id: 4, 
      name: "Grocery Store", 
      date: "Mar 25", 
      amount: -65.30,
      category: "groceries",
      description: "Weekly groceries",
      location: "Main St Market"
    },
    { 
      id: 5, 
      name: "Electric Bill", 
      date: "Mar 22", 
      amount: -87.45,
      category: "utilities",
      description: "Monthly payment",
      location: "Automatic Payment"
    },
    { 
      id: 6, 
      name: "Restaurant", 
      date: "Mar 18", 
      amount: -42.80,
      category: "food",
      description: "Dinner with friends",
      location: "Downtown"
    },
    { 
      id: 7, 
      name: "Gas Station", 
      date: "Mar 15", 
      amount: -38.50,
      category: "transportation",
      description: "Fuel",
      location: "Highway 101"
    },
    { 
      id: 8, 
      name: "Online Store", 
      date: "Mar 12", 
      amount: -128.99,
      category: "shopping",
      description: "Electronics purchase",
      location: "Online"
    },
    { 
      id: 9, 
      name: "Subscription", 
      date: "Mar 10", 
      amount: -14.99,
      category: "entertainment",
      description: "Monthly subscription",
      location: "Automatic Payment"
    },
    { 
      id: 10, 
      name: "Salary", 
      date: "Mar 1", 
      amount: 3200.00,
      category: "income",
      description: "Monthly salary",
      location: "Direct Deposit"
    }
  ];
  
  // Frequent contacts with country information
  const frequentContacts = [
    { id: 1, name: "Shivanand Kumar", phone: "+91 123-456-789", country: "India", currency: "INR", recent: true, favorite: true },
    { id: 2, name: "John Smith", phone: "+1 555-123-4567", country: "USA", currency: "USD", recent: true, favorite: false },
    { id: 3, name: "Emma Wilson", phone: "+1 555-987-6543", country: "USA", currency: "USD", recent: false, favorite: true },
    { id: 4, name: "Michael Brown", phone: "+1 555-567-8901", country: "USA", currency: "USD", recent: true, favorite: false },
    { id: 5, name: "Olivia Davis", phone: "+44 7700-900123", country: "UK", currency: "GBP", recent: false, favorite: true },
    { id: 6, name: "William Jones", phone: "+61 4XX-XXX-XXX", country: "Australia", currency: "AUD", recent: true, favorite: false }
  ];
  
  // Get budget status for a category
  const getBudgetStatus = (category) => {
    const categoryData = spendingByCategory.find(item => item.category.toLowerCase() === category.toLowerCase());
    if (!categoryData) return { status: "normal", percentage: 0 };
    
    const budgetAmount = budget[category.toLowerCase()] || 0;
    const percentage = (categoryData.amount / budgetAmount) * 100;
    
    if (percentage >= 90) return { status: "danger", percentage };
    if (percentage >= 75) return { status: "warning", percentage };
    return { status: "normal", percentage };
  };
  
  // Theme classes based on dark mode
  const themeClasses = {
    app: darkMode ? "bg-gray-900" : "bg-gray-100",
    card: darkMode ? "bg-gray-800 text-white" : "bg-white",
    text: darkMode ? "text-white" : "text-gray-800",
    subtext: darkMode ? "text-gray-300" : "text-gray-600",
    header: darkMode ? "bg-blue-900" : "bg-blue-500",
    button: darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600",
    input: darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700",
    divider: darkMode ? "border-gray-700" : "border-gray-200"
  };
  
  // Header component
  const Header = ({ title, showBack = true }) => (
    <div className={`${themeClasses.header} text-white p-4 flex items-center`}>
      {showBack && (
        <button 
          onClick={() => navigateTo("dashboard")}
          className="mr-4"
          aria-label="Back to dashboard"
        >
          ←
        </button>
      )}
      <h2 className="text-lg font-semibold">{title}</h2>
      {showBack && <div className="ml-auto">{formatTime()}</div>}
    </div>
  );
  
  // Button component
  const PrimaryButton = ({ text, onClick, className="" }) => (
    <button
      onClick={onClick}
      className={`w-full ${themeClasses.button} text-white py-3 rounded-full font-medium ${className}`}
    >
      {text}
    </button>
  );
  
  // Toast notification
  const Toast = () => {
    if (!showToast) return null;
    
    return (
      <div className="absolute top-4 left-0 right-0 flex justify-center z-50">
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow">
          {toastMessage}
        </div>
      </div>
    );
  };
  
  // Bottom navigation
  const BottomNav = () => (
    <div className={`flex justify-around border-t ${themeClasses.divider} p-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <button 
        onClick={() => navigateTo("dashboard")}
        className={`px-3 py-1 rounded ${currentScreen === "dashboard" ? "bg-blue-100 text-blue-500" : darkMode ? "text-gray-300" : ""}`}
        aria-label="Home"
      >
        Home
      </button>
      <button 
        onClick={() => navigateTo("insights")}
        className={`px-3 py-1 rounded ${currentScreen === "insights" ? "bg-blue-100 text-blue-500" : darkMode ? "text-gray-300" : ""}`}
        aria-label="Insights"
      >
        Insights
      </button>
      <button 
        onClick={() => navigateTo("wallet")}
        className={`px-3 py-1 rounded ${currentScreen === "wallet" ? "bg-blue-100 text-blue-500" : darkMode ? "text-gray-300" : ""}`}
        aria-label="Wallet"
      >
        Wallet
      </button>
      <button 
        onClick={() => navigateTo("transactions")}
        className={`px-3 py-1 rounded ${currentScreen === "transactions" ? "bg-blue-100 text-blue-500" : darkMode ? "text-gray-300" : ""}`}
        aria-label="History"
      >
        History
      </button>
      <button 
        onClick={() => navigateTo("profile")}
        className={`px-3 py-1 rounded ${currentScreen === "profile" ? "bg-blue-100 text-blue-500" : darkMode ? "text-gray-300" : ""}`}
        aria-label="Profile"
      >
        Profile
      </button>
    </div>
  );
  
  // Spending Pie Chart
  const SpendingPieChart = () => (
    <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
      <h3 className="font-medium mb-3">Spending by Category</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={spendingByCategory}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {spendingByCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `$${value.toFixed(2)}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
  
  // Monthly Trends Chart
  const MonthlyTrendsChart = () => (
    <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
      <h3 className="font-medium mb-3">Income vs. Spending</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyTrends}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#eee"} />
            <XAxis dataKey="month" stroke={darkMode ? "#ccc" : "#666"} />
            <YAxis stroke={darkMode ? "#ccc" : "#666"} />
            <Tooltip
              formatter={(value) => `$${value}`}
              labelStyle={{ color: darkMode ? "#fff" : "#000" }}
              contentStyle={{ backgroundColor: darkMode ? "#333" : "#fff" }}
            />
            <Legend />
            <Bar dataKey="income" fill="#4CAF50" name="Income" />
            <Bar dataKey="spending" fill="#F44336" name="Spending" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
  
  // Cash Flow Forecast
  const CashFlowForecast = () => (
    <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
      <h3 className="font-medium mb-3">Cash Flow Forecast</h3>
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className={themeClasses.text}>Current Balance</span>
          <span className="font-semibold">${cashFlowPrediction.currentBalance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className={themeClasses.text}>Month-End Prediction</span>
          <span className={`font-semibold ${cashFlowPrediction.endOfMonthPrediction < cashFlowPrediction.currentBalance ? 'text-red-500' : 'text-green-500'}`}>
            ${cashFlowPrediction.endOfMonthPrediction.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className={themeClasses.text}>Next Month Prediction</span>
          <span className="font-semibold text-green-500">${cashFlowPrediction.nextMonth.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Upcoming Expenses</h4>
        <div className="space-y-2">
          {cashFlowPrediction.upcomingExpenses.map((expense, index) => (
            <div key={index} className="flex justify-between">
              <span className={themeClasses.text}>
                {expense.name} <span className="text-sm opacity-70">({expense.date})</span>
              </span>
              <span className="text-red-500">${expense.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Anticipated Income</h4>
        <div className="space-y-2">
          {cashFlowPrediction.anticipatedIncome.map((income, index) => (
            <div key={index} className="flex justify-between">
              <span className={themeClasses.text}>
                {income.name} <span className="text-sm opacity-70">({income.date})</span>
              </span>
              <span className="text-green-500">${income.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  // Budget Management Component
  const BudgetManager = () => {
    const totalBudget = Object.values(budget).reduce((sum, val) => sum + val, 0);
    const totalSpent = spendingByCategory.reduce((sum, cat) => sum + cat.amount, 0);
    const percentageUsed = (totalSpent / totalBudget) * 100;
    
    return (
      <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Budget Management</h3>
          <div className="flex space-x-2">
            <button 
              className={`px-2 py-1 text-xs rounded ${selectedBudgetPeriod === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedBudgetPeriod('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-2 py-1 text-xs rounded ${selectedBudgetPeriod === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedBudgetPeriod('weekly')}
            >
              Weekly
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className={themeClasses.text}>Total Budget</span>
            <span className="font-semibold">${totalBudget.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className={themeClasses.text}>Spent So Far</span>
            <span className="font-semibold">${totalSpent.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className={themeClasses.text}>Remaining</span>
            <span className={`font-semibold ${(totalBudget - totalSpent) > 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${(totalBudget - totalSpent).toFixed(2)}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className={`h-2.5 rounded-full ${percentageUsed > 100 ? 'bg-red-500' : percentageUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'}`} 
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="space-y-3">
          {Object.entries(budget).map(([category, amount]) => {
            const status = getBudgetStatus(category);
            let statusColor = "bg-green-500";
            if (status.status === "warning") statusColor = "bg-yellow-500";
            if (status.status === "danger") statusColor = "bg-red-500";
            
            const catData = spendingByCategory.find(c => c.category.toLowerCase() === category);
            const spentAmount = catData ? catData.amount : 0;
            
            return (
              <div key={category} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className={`${themeClasses.text} capitalize`}>{category}</span>
                  <div className="text-right">
                    <span className={themeClasses.text}>${spentAmount.toFixed(2)}</span>
                    <span className={themeClasses.subtext}> / ${amount}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${statusColor}`} 
                    style={{ width: `${Math.min(status.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Savings Recommendations Component
  const SavingsRecommendations = () => (
    <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
      <h3 className="font-medium mb-3">Savings Opportunities</h3>
      <div className="space-y-3">
        {savingsRecommendations.map(recommendation => (
          <div key={recommendation.id} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-medium">{recommendation.title}</h4>
              <span className="text-green-500 font-medium">${recommendation.potential}/mo</span>
            </div>
            <p className={`text-sm ${themeClasses.subtext}`}>{recommendation.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
  
  // Contact Selection Component
  const ContactSelection = () => {
    const filteredContacts = selectedContactTab === "recent" 
      ? frequentContacts.filter(contact => contact.recent)
      : frequentContacts.filter(contact => contact.favorite);
      
    return (
      <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
        <div className="flex space-x-2 mb-4">
          <button 
            className={`px-3 py-1.5 rounded-full text-sm ${selectedContactTab === 'recent' ? 'bg-blue-500 text-white' : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}`}
            onClick={() => setSelectedContactTab('recent')}
          >
            Recent
          </button>
          <button 
            className={`px-3 py-1.5 rounded-full text-sm ${selectedContactTab === 'favorites' ? 'bg-blue-500 text-white' : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}`}
            onClick={() => setSelectedContactTab('favorites')}
          >
            Favorites
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {filteredContacts.map(contact => (
            <div 
              key={contact.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                sessionStorage.setItem("selectedContact", JSON.stringify(contact));
                navigateTo("sendMoney");
              }}
            >
              <div className={`w-14 h-14 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center mb-1`}>
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <p className={`text-xs text-center ${themeClasses.text} whitespace-nowrap overflow-hidden text-ellipsis max-w-full`}>
                {contact.name.split(' ')[0]}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Security Status Component
  const SecurityStatus = () => (
    <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
      <h3 className="font-medium mb-3">Account Security</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className={themeClasses.text}>Biometric authentication enabled</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className={themeClasses.text}>Transaction notifications active</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className={themeClasses.text}>Password last updated 45 days ago</span>
        </div>
      </div>
    </div>
  );
  
  // Wallet screen component
  const WalletScreen = () => {
    const [selectedWalletTab, setSelectedWalletTab] = useState("balances");
    
    return (
      <div className={`flex flex-col h-full ${themeClasses.card}`}>
        <Header title="Multi-Currency Wallet" />
        
        <div className="flex-1 p-4 pb-16 overflow-auto">
          <div className="mb-4 flex space-x-2">
            <button 
              className={`px-3 py-1.5 rounded-full text-sm ${selectedWalletTab === 'balances' ? 'bg-blue-500 text-white' : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}`}
              onClick={() => setSelectedWalletTab('balances')}
            >
              Balances
            </button>
            <button 
              className={`px-3 py-1.5 rounded-full text-sm ${selectedWalletTab === 'funding' ? 'bg-blue-500 text-white' : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}`}
              onClick={() => setSelectedWalletTab('funding')}
            >
              Funding Sources
            </button>
            <button 
              className={`px-3 py-1.5 rounded-full text-sm ${selectedWalletTab === 'exchange' ? 'bg-blue-500 text-white' : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}`}
              onClick={() => setSelectedWalletTab('exchange')}
            >
              Exchange
            </button>
          </div>
          
          {selectedWalletTab === 'balances' && (
            <>
              <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4 border ${themeClasses.divider}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-medium ${themeClasses.text}`}>Currency Balances</h3>
                  <button className="text-blue-500 text-sm">Add Currency</button>
                </div>
                
                <div className="space-y-4">
                  {walletBalances.map(wallet => (
                    <div key={wallet.currency} className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-500 font-semibold">{wallet.currency}</span>
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${themeClasses.text}`}>{wallet.currency} Wallet</p>
                        <p className={`text-xs ${themeClasses.subtext}`}>
                          Last used: {wallet.currency === "USD" ? "Today" : wallet.currency === "INR" ? "Yesterday" : "2 weeks ago"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${themeClasses.text}`}>{wallet.symbol}{wallet.balance.toFixed(2)}</p>
                        <p className={`text-xs ${themeClasses.subtext}`}>
                          ≈ ${(wallet.balance / exchangeRates[wallet.currency]).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  className={`w-full mt-4 py-2 border border-blue-500 text-blue-500 rounded-full`}
                  onClick={() => setSelectedWalletTab('exchange')}
                >
                  Exchange Currencies
                </button>
              </div>
              
              <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
                <h3 className={`font-medium mb-3 ${themeClasses.text}`}>Total Balance</h3>
                <p className={`text-2xl font-bold ${themeClasses.text}`}>
                  ${walletBalances.reduce((sum, wallet) => sum + (wallet.balance / exchangeRates[wallet.currency]), 0).toFixed(2)}
                </p>
                <p className={`text-sm ${themeClasses.subtext}`}>Across all currencies</p>
              </div>
              
              <div className={`${themeClasses.card} p-4 rounded-lg shadow`}>
                <h3 className={`font-medium mb-3 ${themeClasses.text}`}>Transaction History</h3>
                
                <div className="space-y-3">
                  {transactions.slice(0, 3).map(tx => (
                    <div key={tx.id} className="flex items-center">
                      <div className={`w-8 h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mr-2 flex items-center justify-center text-xs`}>
                        {tx.name.substring(0, 2)}
                      </div>
                      <div className="flex-1 mr-2">
                        <p className={`text-sm font-medium ${themeClasses.text}`}>{tx.name}</p>
                        <p className={`text-xs ${themeClasses.subtext}`}>{tx.date}</p>
                      </div>
                      <p className={`text-sm ${tx.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                        {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <button 
                  className="w-full text-center text-blue-500 text-xs mt-3"
                  onClick={() => navigateTo("transactions")}
                >
                  View all transactions →
                </button>
              </div>
            </>
          )}
          
          {selectedWalletTab === 'funding' && (
            <>
              <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-medium ${themeClasses.text}`}>Your Funding Sources</h3>
                  <button className="text-blue-500 text-sm">+ Add New</button>
                </div>
                
                <div className="space-y-4">
                  {fundingSources.map(source => (
                    <div 
                      key={source.id} 
                      className={`p-3 rounded-lg border ${themeClasses.divider} ${source.isDefault ? darkMode ? 'bg-blue-900/20' : 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          {source.type === "bank" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                          ) : source.type === "card" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                              <line x1="2" y1="10" x2="22" y2="10"></line>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M2 12h20"></path>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center">
                            <p className={`font-medium ${themeClasses.text}`}>{source.name}</p>
                            {source.isDefault && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className={`text-xs ${themeClasses.subtext}`}>{source.accountNumber}</p>
                        </div>
                        
                        <button className="text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`${themeClasses.card} p-4 rounded-lg shadow`}>
                <h3 className={`font-medium mb-3 ${themeClasses.text}`}>Add Funds to Wallet</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <label className={`block flex-1 ${themeClasses.text}`}>Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input 
                        type="text" 
                        className={`${themeClasses.input} pl-6 py-1 rounded w-32`}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <label className={`block flex-1 ${themeClasses.text}`}>Source</label>
                    <select className={`${themeClasses.input} py-1 px-2 rounded w-32`}>
                      {fundingSources.map(source => (
                        <option key={source.id} value={source.id}>
                          {source.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pt-2">
                    <button className={`w-full bg-blue-500 text-white py-2 rounded-full`}>
                      Add Funds
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {selectedWalletTab === 'exchange' && (
            <>
              <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
                <h3 className={`font-medium mb-4 ${themeClasses.text}`}>Exchange Currencies</h3>
                
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg border ${themeClasses.divider}`}>
                    <label className={`block text-sm ${themeClasses.subtext} mb-1`}>From</label>
                    <div className="flex">
                      <select className={`flex-1 ${themeClasses.input} rounded-l py-2 px-3 border-r-0`}>
                        {walletBalances.map(wallet => (
                          <option key={`from-${wallet.currency}`} value={wallet.currency}>
                            {wallet.currency} - {wallet.symbol}{wallet.balance.toFixed(2)}
                          </option>
                        ))}
                      </select>
                      <input 
                        type="text" 
                        className={`${themeClasses.input} rounded-r py-2 px-3 w-32 text-right`}
                        placeholder="Amount"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <button className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 10v12"></path>
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                        <path d="M3 3v5h5"></path>
                        <path d="M17 14v-2a4 4 0 0 0-4-4h-2"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className={`p-3 rounded-lg border ${themeClasses.divider}`}>
                    <label className={`block text-sm ${themeClasses.subtext} mb-1`}>To</label>
                    <div className="flex">
                      <select className={`flex-1 ${themeClasses.input} rounded-l py-2 px-3 border-r-0`}>
                        {Object.keys(exchangeRates).map(currency => (
                          <option key={`to-${currency}`} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </select>
                      <input 
                        type="text" 
                        className={`${themeClasses.input} rounded-r py-2 px-3 w-32 text-right`}
                        placeholder="You'll get"
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`text-sm ${themeClasses.text} text-center`}>
                      Exchange Rate: 1 USD = 83.12 INR
                    </p>
                    <p className={`text-xs ${themeClasses.subtext} text-center mt-1`}>
                      Fee: $0.00 • Blockchain secured transfer
                    </p>
                  </div>
                  
                  <button className={`w-full bg-blue-500 text-white py-3 rounded-full font-medium`}>
                    Exchange
                  </button>
                </div>
              </div>
              
              <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
                <h3 className={`font-medium mb-3 ${themeClasses.text}`}>Exchange Rates</h3>
                
                <div className="space-y-3">
                  {Object.entries(exchangeRates).slice(0, 5).map(([currency, rate]) => (
                    <div key={currency} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                          <span className="text-gray-700 font-medium text-sm">{currency}</span>
                        </div>
                        <span className={themeClasses.text}>{currency}</span>
                      </div>
                      <span className={themeClasses.text}>
                        {(1 / rate).toFixed(4)} USD
                      </span>
                    </div>
                  ))}
                </div>
                
                <p className={`text-xs ${themeClasses.subtext} text-center mt-4`}>
                  Rates updated: March 1, 2025 • 10:30 AM
                </p>
              </div>
            </>
          )}
        </div>
        
        <BottomNav />
      </div>
    );
  };
  
  // Funding sources screen
  const FundingSourcesScreen = () => {
    return (
      <div className={`flex flex-col h-full ${themeClasses.card}`}>
        <Header title="Funding Sources" />
        
        <div className="flex-1 p-4 pb-16 overflow-auto">
          <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-medium ${themeClasses.text}`}>Connected Accounts</h3>
              <button className="text-blue-500 text-sm">+ Add New</button>
            </div>
            
            <div className="space-y-4">
              {fundingSources.map(source => (
                <div 
                  key={source.id} 
                  className={`p-3 rounded-lg border ${themeClasses.divider} ${source.isDefault ? darkMode ? 'bg-blue-900/20' : 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      {source.type === "bank" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                      ) : source.type === "card" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                          <line x1="2" y1="10" x2="22" y2="10"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M2 12h20"></path>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className={`font-medium ${themeClasses.text}`}>{source.name}</p>
                        {source.isDefault && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${themeClasses.subtext}`}>{source.accountNumber}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {!source.isDefault && (
                        <button 
                          className="text-blue-500 text-xs"
                          onClick={() => showToastMessage(`${source.name} set as default`)}
                        >
                          Set Default
                        </button>
                      )}
                      <button className="text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
            <h3 className={`font-medium mb-3 ${themeClasses.text}`}>Add New Funding Source</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border ${themeClasses.divider} flex flex-col items-center cursor-pointer`}>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <p className={`text-sm text-center ${themeClasses.text}`}>Link Bank Account</p>
              </div>
              
              <div className={`p-3 rounded-lg border ${themeClasses.divider} flex flex-col items-center cursor-pointer`}>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                </div>
                <p className={`text-sm text-center ${themeClasses.text}`}>Add Debit/Credit Card</p>
              </div>
              
              <div className={`p-3 rounded-lg border ${themeClasses.divider} flex flex-col items-center cursor-pointer`}>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <p className={`text-sm text-center ${themeClasses.text}`}>International Account</p>
              </div>
              
              <div className={`p-3 rounded-lg border ${themeClasses.divider} flex flex-col items-center cursor-pointer`}>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                </div>
                <p className={`text-sm text-center ${themeClasses.text}`}>Other Methods</p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-blue-900/30 border-blue-900/50' : 'bg-blue-50 border-blue-100'} p-4 rounded-lg border`}>
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${darkMode ? 'text-blue-300' : 'text-blue-500'} mt-0.5 mr-2 flex-shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  Security Note
                </p>
                <p className={`text-xs ${darkMode ? 'text-blue-200' : 'text-blue-600'} mt-1`}>
                  All funding sources are protected by your Blockchain ID. Your account details are encrypted and never stored on our servers in their original form.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <BottomNav />
      </div>
    );
  };
  
  
  // SendMoneyScreen component
  const SendMoneyScreen = () => {
    // Get selected contact from session storage
    const [contact, setContact] = useState(null);
    const [localRecipientCurrency, setLocalRecipientCurrency] = useState("INR");
    
    // Load contact on component mount
    useEffect(() => {
      const contactJson = sessionStorage.getItem("selectedContact");
      if (contactJson) {
        try {
          const contactData = JSON.parse(contactJson);
          setContact(contactData);
          if (contactData && contactData.currency) {
            setLocalRecipientCurrency(contactData.currency);
            setRecipientCurrency(contactData.currency);
          }
        } catch (e) {
          // Invalid JSON, ignore
        }
      }
    }, []);
    
    // Calculate exchange rate preview
    const exchangePreview = (() => {
      if (!amount || isNaN(parseFloat(amount))) return null;
      const amountValue = parseFloat(amount);
      if (selectedCurrency === recipientCurrency) return null;
      
      const convertedAmount = calculateExchangeAmount(amountValue, selectedCurrency, recipientCurrency);
      const rate = exchangeRates[recipientCurrency] / exchangeRates[selectedCurrency];
      
      return {
        convertedAmount,
        rate,
        text: `1 ${selectedCurrency} = ${rate.toFixed(4)} ${recipientCurrency}`
      };
    })();
    
    return (
      <div className={`flex flex-col h-full ${themeClasses.card}`}>
        <Header title="Send Money" />
        
        {showBlockchainVerification && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className={`${themeClasses.card} p-6 rounded-lg max-w-xs w-full text-center`}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                  <polyline points="17 2 12 7 7 2"></polyline>
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>Verifying Transaction</h3>
              <p className={`text-sm ${themeClasses.subtext} mb-2`}>
                Blockchain verification in progress...
              </p>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-[loadingBar_2s_ease-in-out]"></div>
              </div>
              <p className="text-xs mt-4 text-blue-500">Securing transaction with Blockchain ID</p>
            </div>
          </div>
        )}
        
        <div className="flex-1 p-4">
          <div className="flex flex-col items-center mb-4">
            <div className={`w-16 h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center mb-2`}>
              {contact 
                ? contact.name.split(' ').map(n => n[0]).join('')
                : "SK"}
            </div>
            <h3 className={`font-semibold ${themeClasses.text}`}>
              {contact ? contact.name : "Shivanand Kumar"}
            </h3>
            <p className={`text-sm ${themeClasses.subtext}`}>
              {contact ? contact.phone : "+91 123-456-789"}
            </p>
            <p className={`text-xs ${themeClasses.subtext} mt-1`}>
              {contact ? contact.country : "India"}
            </p>
          </div>
          
          {/* Currency selector */}
          <div className={`mb-4 ${themeClasses.card} rounded-lg p-3 border ${themeClasses.divider}`}>
            <div className="flex justify-between items-center mb-2">
              <p className={`text-sm font-medium ${themeClasses.text}`}>Choose sending currency</p>
              <select 
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className={`${themeClasses.input} rounded px-2 py-1 text-sm`}
              >
                {Object.keys(exchangeRates).map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <p className={`text-sm font-medium ${themeClasses.text}`}>Recipient receives in</p>
              <select 
                value={recipientCurrency}
                onChange={(e) => setRecipientCurrency(e.target.value)}
                className={`${themeClasses.input} rounded px-2 py-1 text-sm`}
              >
                {Object.keys(exchangeRates).map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Funding source selector */}
          <div className={`mb-4 ${themeClasses.card} rounded-lg p-3 border ${themeClasses.divider}`}>
            <div className="flex justify-between items-center">
              <p className={`text-sm font-medium ${themeClasses.text}`}>Funding Source</p>
              <select 
                value={selectedFundingSource.id}
                onChange={(e) => {
                  const source = fundingSources.find(s => s.id === parseInt(e.target.value));
                  if (source) setSelectedFundingSource(source);
                }}
                className={`${themeClasses.input} rounded px-2 py-1 text-sm`}
              >
                {fundingSources.map(source => (
                  <option key={source.id} value={source.id}>
                    {source.name} ({source.accountNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-col items-center mb-4">
            <p className={`${themeClasses.subtext} mb-2`}>Enter Amount</p>
            <div className="relative mb-2 w-full">
              <span className={`absolute left-0 bottom-3 text-2xl ${themeClasses.text}`}>
                {selectedCurrency === "USD" ? "$" : 
                 selectedCurrency === "INR" ? "₹" : 
                 selectedCurrency === "EUR" ? "€" : 
                 selectedCurrency === "GBP" ? "£" : ""}
              </span>
              <input 
                type="text"
                className={`w-full pb-2 text-center text-4xl font-bold border-b-2 border-blue-500 focus:outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}
                value={amount}
                onChange={(e) => {
                  // Allow only numbers and up to 2 decimal places
                  if (/^\d*\.?\d{0,2}$/.test(e.target.value)) {
                    setAmount(e.target.value);
                  }
                }}
              />
            </div>
            
            {/* Exchange rate preview */}
            {exchangePreview && (
              <div className={`w-full text-center ${themeClasses.subtext} text-sm mb-4`}>
                <p>
                  {recipientCurrency === "USD" ? "$" : 
                   recipientCurrency === "INR" ? "₹" : 
                   recipientCurrency === "EUR" ? "€" : 
                   recipientCurrency === "GBP" ? "£" : ""}
                  {exchangePreview.convertedAmount.toFixed(2)} {recipientCurrency}
                </p>
                <p className="text-xs mt-1">Rate: {exchangePreview.text}</p>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <input 
              type="text" 
              className={`w-full px-4 py-3 rounded-lg border ${themeClasses.input}`}
              placeholder="Add a note (optional)"
            />
          </div>
          
          <PrimaryButton 
            text={`Send ${selectedCurrency} Payment`}
            onClick={sendMoney}
          />
          
          <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                <polyline points="17 2 12 7 7 2"></polyline>
              </svg>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'} text-left`}>
                Your transaction will be secured with Blockchain ID technology. No intermediaries needed for cross-border payments.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render different screens
  const renderScreen = () => {
    switch(currentScreen) {
      case "welcome":
        return (
          <div className={`p-6 flex flex-col items-center ${themeClasses.card} h-full`}>
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-500"></div>
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${themeClasses.text}`}>Munir Fintech</h1>
            <p className={`text-center ${themeClasses.subtext} mb-6`}>
              Secure cross-border payments with blockchain technology
            </p>
            
            <div className={`w-full p-4 mb-6 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <p className={`text-center ${darkMode ? 'text-blue-200' : 'text-blue-800'} text-sm`}>
                "Any payment should be seamless like making a phone call where your cell phone number is the passport for payments"
              </p>
            </div>
            
            <div className="w-full mb-6 grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm flex flex-col items-center`}>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </div>
                <p className={`text-xs text-center ${themeClasses.text}`}>Seamless Cross-Border Payments</p>
              </div>
              
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm flex flex-col items-center`}>
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <p className={`text-xs text-center ${themeClasses.text}`}>Blockchain Security</p>
              </div>
              
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm flex flex-col items-center`}>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <p className={`text-xs text-center ${themeClasses.text}`}>Multi-Currency Support</p>
              </div>
              
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm flex flex-col items-center`}>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <p className={`text-xs text-center ${themeClasses.text}`}>Instant Settlement</p>
              </div>
            </div>
            
            <PrimaryButton 
              text="Get Started" 
              onClick={() => navigateTo("dashboard")}
            />
            <button 
              className={`w-full border-2 border-blue-500 text-blue-500 py-3 rounded-full mt-3`}
              onClick={() => navigateTo("login")}
            >
              Log In
            </button>
            
            <button 
              className={`mt-6 text-sm ${themeClasses.subtext}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        );
        
      case "dashboard":
        return (
          <div className={`flex flex-col h-full ${themeClasses.card}`}>
            <Header title="Dashboard" showBack={false} />
            
            <div className="flex-1 p-4 pb-16 overflow-auto">
              {/* Anomaly Alert */}
              {showAnomalyAlert && (
                <div className="mb-4 bg-yellow-50 rounded-lg p-3 border border-yellow-100 relative">
                  <button 
                    className="absolute top-2 right-2"
                    onClick={() => setShowAnomalyAlert(false)}
                    aria-label="Close alert"
                  >
                    ✕
                  </button>
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                      ⚠️
                    </div>
                    <div>
                      <p className="text-yellow-800 text-sm font-medium mb-1">
                        Unusual transaction detected
                      </p>
                      <p className="text-yellow-700 text-xs pr-6">
                        We noticed a high-value purchase of $128.99 at "Online Store". Is this yours?
                      </p>
                      <div className="flex mt-2">
                        <button 
                          className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full mr-2"
                          onClick={() => navigateTo("transactions")}
                        >
                          Review
                        </button>
                        <button 
                          className="bg-white text-yellow-700 border border-yellow-500 text-xs px-3 py-1 rounded-full"
                          onClick={() => setShowAnomalyAlert(false)}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Multi-Currency Wallet Cards */}
              <div className="mb-4 overflow-x-auto pb-2">
                <div className="flex space-x-3" style={{ minWidth: 'max-content' }}>
                  {walletBalances.map((wallet, index) => (
                    <div 
                      key={wallet.currency}
                      className={`${wallet.currency === activeWalletCurrency ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'} 
                                  text-${wallet.currency === activeWalletCurrency ? 'white' : darkMode ? 'white' : 'gray-800'} 
                                  p-4 rounded-xl shadow-sm min-w-[200px] cursor-pointer`}
                      onClick={() => setActiveWalletCurrency(wallet.currency)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <p className={`text-sm ${wallet.currency === activeWalletCurrency ? 'text-white/80' : darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {wallet.currency} Wallet
                        </p>
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          {wallet.currency === "USD" && "$"}
                          {wallet.currency === "INR" && "₹"}
                          {wallet.currency === "EUR" && "€"}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold">
                        {wallet.symbol}{wallet.balance.toFixed(2)}
                      </h3>
                    </div>
                  ))}
                  
                  <div 
                    className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 border border-gray-200'} 
                                p-4 rounded-xl shadow-sm min-w-[100px] flex flex-col items-center justify-center cursor-pointer`}
                    onClick={() => navigateTo("wallet")}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </div>
                    <p className="text-xs">Add Currency</p>
                  </div>
                </div>
              </div>
              
              {/* Blockchain Security Status */}
              <div className={`mb-4 p-3 rounded-lg border ${darkMode ? 'bg-blue-900/30 border-blue-900/50' : 'bg-blue-50 border-blue-100'}`}>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                      <polyline points="17 2 12 7 7 2"></polyline>
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      Blockchain ID Active & Secured
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                      Your digital passport is working as expected
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Budget Summary */}
              <div className={`${themeClasses.card} p-3 rounded-lg shadow mb-4`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`font-medium ${themeClasses.text}`}>Budget Overview</h3>
                  <button 
                    className="text-blue-500 text-sm"
                    onClick={() => navigateTo("budget")}
                  >
                    Manage
                  </button>
                </div>
                
                <div className="space-y-2">
                  {Object.entries(budget).slice(0, 3).map(([category, amount]) => {
                    const status = getBudgetStatus(category);
                    const catData = spendingByCategory.find(c => c.category.toLowerCase() === category);
                    const spentAmount = catData ? catData.amount : 0;
                    
                    return (
                      <div key={category} className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: catData?.color || '#ccc' }}></div>
                        <span className={`capitalize text-sm ${themeClasses.text}`}>{category}</span>
                        <div className="flex-1 mx-2 h-1.5 bg-gray-200 rounded-full">
                          <div 
                            className={`h-1.5 rounded-full ${status.status === 'danger' ? 'bg-red-500' : status.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(status.percentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">
                          ${spentAmount.toFixed(0)}<span className={themeClasses.subtext}>/${amount}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <button 
                  className="w-full text-center text-blue-500 text-xs mt-2"
                  onClick={() => navigateTo("insights")}
                >
                  View spending insights →
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="mb-6">
                <h3 className={`font-medium mb-2 ${themeClasses.text}`}>Quick Actions</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div 
                    className={`${themeClasses.card} p-3 rounded-xl shadow text-center cursor-pointer`}
                    onClick={() => navigateTo("sendMoney")}
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13"></path>
                        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                      </svg>
                    </div>
                    <p className={`text-sm ${themeClasses.text}`}>Send</p>
                  </div>
                  <div 
                    className={`${themeClasses.card} p-3 rounded-xl shadow text-center cursor-pointer`}
                    onClick={() => navigateTo("wallet")}
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                      </svg>
                    </div>
                    <p className={`text-sm ${themeClasses.text}`}>Wallet</p>
                  </div>
                  <div 
                    className={`${themeClasses.card} p-3 rounded-xl shadow text-center cursor-pointer`}
                    onClick={() => navigateTo("insights")}
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                    </div>
                    <p className={`text-sm ${themeClasses.text}`}>Insights</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Selection */}
              <ContactSelection />
              
              {/* Transactions */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`font-medium ${themeClasses.text}`}>Recent Transactions</h3>
                  <button 
                    className="text-blue-500 text-sm"
                    onClick={() => navigateTo("transactions")}
                  >
                    See All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {transactions.slice(0, 4).map(tx => (
                    <div 
                      key={tx.id} 
                      className={`${themeClasses.card} p-3 rounded-lg shadow flex items-center cursor-pointer`}
                      onClick={() => {
                        sessionStorage.setItem("selectedTransaction", JSON.stringify(tx));
                        navigateTo("transactionDetail");
                      }}
                    >
                      <div className={`w-10 h-10 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mr-3 flex items-center justify-center`}>
                        {tx.name.substring(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${themeClasses.text}`}>{tx.name}</p>
                        <p className={`text-xs ${themeClasses.subtext}`}>{tx.date}</p>
                      </div>
                      <p className={tx.amount < 0 ? "text-red-500" : "text-green-500"}>
                        {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <BottomNav />
          </div>
        );
        
      case "insights":
        return (
          <div className={`flex flex-col h-full ${themeClasses.card}`}>
            <Header title="Financial Insights" />
            
            <div className="flex-1 p-4 pb-16 overflow-auto">
              <div className="mb-4 flex space-x-2">
                <button 
                  className={`px-3 py-1.5 rounded-full text-sm ${selectedInsightTab === 'spending' ? 'bg-blue-500 text-white' : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}`}
                  onClick={() => setSelectedInsightTab('spending')}
                >
                  Spending
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-full text-sm ${selectedInsightTab === 'budget' ? 'bg-blue-500 text-white' : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}`}
                  onClick={() => setSelectedInsightTab('budget')}
                >
                  Budget
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-full text-sm ${selectedInsightTab === 'cashflow' ? 'bg-blue-500 text-white' : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}`}
                  onClick={() => setSelectedInsightTab('cashflow')}
                >
                  Cash Flow
                </button>
              </div>
              
              {selectedInsightTab === 'spending' && (
                <>
                  <SpendingPieChart />
                  <MonthlyTrendsChart />
                  <SavingsRecommendations />
                </>
              )}
              
              {selectedInsightTab === 'budget' && (
                <>
                  <BudgetManager />
                  <SavingsRecommendations />
                </>
              )}
              
              {selectedInsightTab === 'cashflow' && (
                <>
                  <CashFlowForecast />
                  <MonthlyTrendsChart />
                </>
              )}
            </div>
            
            <BottomNav />
          </div>
        );
        
      case "budget":
        return (
          <div className={`flex flex-col h-full ${themeClasses.card}`}>
            <Header title="Budget Management" />
            
            <div className="flex-1 p-4 pb-16 overflow-auto">
              <BudgetManager />
              
              <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
                <h3 className={`font-medium mb-3 ${themeClasses.text}`}>Edit Category Budgets</h3>
                
                <div className="space-y-4">
                  {Object.entries(budget).map(([category, amount]) => (
                    <div key={category} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" 
                           style={{ backgroundColor: spendingByCategory.find(c => c.category.toLowerCase() === category)?.color || '#ccc' }}></div>
                      <span className={`capitalize flex-1 ${themeClasses.text}`}>{category}</span>
                      <div className="relative">
                        <span className={`absolute left-3 top-2 ${themeClasses.text}`}>$</span>
                        <input 
                          type="number" 
                          className={`${themeClasses.input} w-24 pl-6 py-1 rounded border text-right`}
                          value={amount}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value >= 0) {
                              setBudget(prev => ({...prev, [category]: value}));
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  className={`w-full ${themeClasses.button} text-white py-2 rounded-full mt-4`}
                  onClick={() => {
                    showToastMessage("Budget updated successfully!");
                    navigateTo("insights");
                  }}
                >
                  Save Changes
                </button>
              </div>
              
              <SavingsRecommendations />
            </div>
            
            <BottomNav />
          </div>
        );
        
      case "sendMoney":
        return <SendMoneyScreen />;

        
      case "paymentSuccess":
        // Calculate the formatted amounts for display
        const formattedAmount = () => {
          const amountValue = parseFloat(amount);
          const sourceCurrencySymbol = selectedCurrency === "USD" ? "$" : 
            selectedCurrency === "INR" ? "₹" : 
            selectedCurrency === "EUR" ? "€" : 
            selectedCurrency === "GBP" ? "£" : selectedCurrency;
          
          return `${sourceCurrencySymbol}${amountValue.toFixed(2)}`;
        };
        
        const formattedConvertedAmount = () => {
          if (selectedCurrency === recipientCurrency) return null;
          
          const amountValue = parseFloat(amount);
          const convertedAmount = calculateExchangeAmount(amountValue, selectedCurrency, recipientCurrency);
          const targetCurrencySymbol = recipientCurrency === "USD" ? "$" : 
            recipientCurrency === "INR" ? "₹" : 
            recipientCurrency === "EUR" ? "€" : 
            recipientCurrency === "GBP" ? "£" : recipientCurrency;
          
          return `${targetCurrencySymbol}${convertedAmount.toFixed(2)}`;
        };
        
        const blockchainId = "0x8a21b4c19d7c25f3e94d7b1f850c91d62a67e4d9b31c5fc2b9";
        
        return (
          <div className={`flex flex-col h-full ${themeClasses.card}`}>
            <Header title="Payment Success" />
            
            <div className="flex-1 p-6 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
              
              <h2 className={`text-xl font-semibold mb-2 ${themeClasses.text}`}>{formattedAmount()} Sent!</h2>
              
              {formattedConvertedAmount() && (
                <p className={`${themeClasses.text} text-sm mb-1`}>
                  {formattedConvertedAmount()} received by recipient
                </p>
              )}
              
              <p className={`${themeClasses.subtext} mb-6`}>
                to Shivanand Kumar • +91 123-456-789
              </p>
              
              <div className={`w-full p-4 border ${themeClasses.divider} rounded-lg mb-6 ${themeClasses.card}`}>
                <div className="mb-4">
                  <p className={`${themeClasses.subtext} text-sm`}>Transaction ID</p>
                  <p className={`font-medium ${themeClasses.text}`}>TX123456789</p>
                </div>
                
                <div className={`pt-4 border-t ${themeClasses.divider}`}>
                  <p className={`${themeClasses.subtext} text-sm`}>Date & Time</p>
                  <p className={`font-medium ${themeClasses.text}`}>March 1, 2025 • 10:45 AM</p>
                </div>
                
                <div className={`pt-4 mt-4 border-t ${themeClasses.divider}`}>
                  <p className={`${themeClasses.subtext} text-sm`}>Blockchain Verification</p>
                  <div className="flex items-center">
                    <p className={`font-medium ${themeClasses.text} truncate`}>{blockchainId.substring(0, 15)}...</p>
                    <button 
                      onClick={() => showToastMessage("Blockchain ID copied to clipboard")}
                      className="ml-2 text-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {selectedCurrency !== recipientCurrency && (
                  <div className={`pt-4 mt-4 border-t ${themeClasses.divider}`}>
                    <p className={`${themeClasses.subtext} text-sm`}>Exchange Rate</p>
                    <p className={`font-medium ${themeClasses.text}`}>
                      1 {selectedCurrency} = {(exchangeRates[recipientCurrency] / exchangeRates[selectedCurrency]).toFixed(4)} {recipientCurrency}
                    </p>
                  </div>
                )}
                
                <div className={`pt-4 mt-4 border-t ${themeClasses.divider}`}>
                  <p className={`${themeClasses.subtext} text-sm`}>Funding Source</p>
                  <p className={`font-medium ${themeClasses.text}`}>
                    {selectedFundingSource.name} ({selectedFundingSource.accountNumber})
                  </p>
                </div>
              </div>
              
              <div className={`w-full p-3 mb-6 rounded-lg bg-blue-50 border border-blue-100 ${darkMode ? 'bg-blue-900 border-blue-800' : ''}`}>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#93c5fd" : "#1d4ed8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-0.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <div>
                    <p className={darkMode ? 'text-blue-200' : 'text-blue-800'}>
                      <span className="font-semibold">Instant settlement complete.</span> Your transaction was secured with Blockchain ID technology.
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      No intermediaries were needed for this cross-border payment.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="w-full flex space-x-3">
                <button 
                  className={`flex-1 border ${themeClasses.divider} py-3 rounded-full ${themeClasses.text}`}
                  onClick={() => {
                    showToastMessage("Transaction receipt sent to your email");
                  }}
                >
                  Email Receipt
                </button>
                
                <PrimaryButton 
                  text="Back to Dashboard" 
                  onClick={() => navigateTo("dashboard")}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        );
        
      case "transactions":
        return (
          <div className={`flex flex-col h-full ${themeClasses.card}`}>
            <Header title="Transaction History" />
            
            <div className="flex-1 p-4 pb-16 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="relative">
                  <input 
                    type="text" 
                    className={`pl-8 pr-4 py-2 rounded-full ${themeClasses.input}`}
                    placeholder="Search transactions..."
                  />
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`absolute left-3 top-2.5 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                
                <button className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
                  Filter
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className={`mb-2 font-medium ${themeClasses.text}`}>March 2025</h3>
                <div className="space-y-3">
                  {transactions.map(tx => (
                    <div 
                      key={tx.id} 
                      className={`${themeClasses.card} p-3 rounded-lg shadow flex items-center cursor-pointer`}
                      onClick={() => {
                        sessionStorage.setItem("selectedTransaction", JSON.stringify(tx));
                        navigateTo("transactionDetail");
                      }}
                    >
                      <div className={`w-10 h-10 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mr-3 flex items-center justify-center`}>
                        {tx.name.substring(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${themeClasses.text}`}>{tx.name}</p>
                        <p className={`text-xs ${themeClasses.subtext}`}>{tx.date} • {tx.category}</p>
                      </div>
                      <p className={tx.amount < 0 ? "text-red-500" : "text-green-500"}>
                        {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <BottomNav />
          </div>
        );
        
      case "transactionDetail":
        // Try to get selected transaction from session storage
        const selectedTx = (() => {
          const txJson = sessionStorage.getItem("selectedTransaction");
          if (txJson) {
            try {
              return JSON.parse(txJson);
            } catch (e) {
              // Default to the first transaction if parsing fails
              return transactions[0];
            }
          }
          // Default to the first transaction if not found
          return transactions[0];
        })();
        
        return (
          <div className={`flex flex-col h-full ${themeClasses.card}`}>
            <Header title="Transaction Details" />
            
            <div className="flex-1 p-4 overflow-auto">
              <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4`}>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mr-3 flex items-center justify-center`}>
                    {selectedTx.name.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${themeClasses.text}`}>{selectedTx.name}</h3>
                    <p className={`text-sm ${themeClasses.subtext}`}>{selectedTx.date}</p>
                  </div>
                </div>
                
                <div className="flex justify-center my-4">
                  <span className={`text-2xl font-bold ${selectedTx.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                    {selectedTx.amount < 0 ? "-" : "+"}${Math.abs(selectedTx.amount).toFixed(2)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={themeClasses.subtext}>Category</span>
                    <span className={`capitalize ${themeClasses.text}`}>{selectedTx.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={themeClasses.subtext}>Description</span>
                    <span className={themeClasses.text}>{selectedTx.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={themeClasses.subtext}>Location</span>
                    <span className={themeClasses.text}>{selectedTx.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={themeClasses.subtext}>Transaction ID</span>
                    <span className={themeClasses.text}>TX{Math.floor(Math.random() * 1000000000)}</span>
                  </div>
                </div>
              </div>
              
              {selectedTx.category === "shopping" && selectedTx.amount === -128.99 && (
                <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg mb-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center mr-2">
                      ⚠️
                    </div>
                    <div>
                      <p className="text-yellow-800 text-sm font-medium mb-1">
                        Flagged as unusual activity
                      </p>
                      <p className="text-yellow-700 text-xs">
                        This transaction is 85% higher than your typical shopping transactions.
                      </p>
                      <div className="flex mt-2">
                        <button 
                          className="bg-red-500 text-white text-xs px-3 py-1 rounded-full mr-2"
                          onClick={() => showToastMessage("Transaction reported as fraudulent")}
                        >
                          Report Fraud
                        </button>
                        <button 
                          className="bg-green-500 text-white text-xs px-3 py-1 rounded-full"
                          onClick={() => showToastMessage("Transaction confirmed as legitimate")}
                        >
                          Confirm Legitimate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <button 
                  className={`w-full py-2 mb-2 border border-blue-500 text-blue-500 rounded-full`}
                  onClick={() => showToastMessage("Receipt downloaded")}
                >
                  Download Receipt
                </button>
                
                {selectedTx.amount < 0 && (
                  <button 
                    className={`w-full py-2 border border-purple-500 text-purple-500 rounded-full mb-2`}
                    onClick={() => showToastMessage("Transaction added to tax deductions")}
                  >
                    Add to Tax Deductions
                  </button>
                )}
                
                {selectedTx.category === "transfer" && selectedTx.amount < 0 && (
                  <button 
                    className={`w-full py-2 border border-green-500 text-green-500 rounded-full`}
                    onClick={() => {
                      setAmount(Math.abs(selectedTx.amount).toFixed(2));
                      navigateTo("sendMoney");
                    }}
                  >
                    Send Again
                  </button>
                )}
              </div>
            </div>
            
            <BottomNav />
          </div>
        );
        
      case "profile":
        return (
          <div className={`flex flex-col h-full ${themeClasses.card}`}>
            <Header title="Profile" />
            
            <div className="flex-1 p-4 pb-16 overflow-auto">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  JS
                </div>
                <h3 className={`font-semibold ${themeClasses.text}`}>Jordan Smith</h3>
                <p className={`text-sm ${themeClasses.subtext}`}>jordan.smith@example.com</p>
                <p className={`text-xs ${themeClasses.subtext}`}>+1 917-667-3847</p>
                
                <div className="flex mt-2 space-x-2">
                  <button 
                    className="text-blue-500 text-sm"
                    onClick={() => showToastMessage("Profile edit coming soon")}
                  >
                    Edit Profile
                  </button>
                  <span className={themeClasses.subtext}>•</span>
                  <button 
                    className="text-blue-500 text-sm"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>
                </div>
              </div>
              
              {/* Blockchain ID Status */}
              <div className={`${themeClasses.card} p-4 rounded-lg shadow mb-4 border ${darkMode ? 'border-blue-900' : 'border-blue-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-medium ${themeClasses.text}`}>Blockchain ID</h3>
                  <div className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                    Active
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <p className={`text-sm ${themeClasses.subtext}`}>ID</p>
                  <div className="flex items-center">
                    <p className={`${themeClasses.text} font-mono text-sm`}>{blockchainId.id}</p>
                    <button className="ml-2 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <p className={`text-sm ${themeClasses.subtext}`}>Type</p>
                  <p className={`${themeClasses.text} capitalize`}>{blockchainId.type} ledger</p>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <p className={`text-sm ${themeClasses.subtext}`}>Security Level</p>
                  <p className={`${themeClasses.text} capitalize`}>{blockchainId.securityLevel}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className={`text-sm ${themeClasses.subtext}`}>Last Verified</p>
                  <p className={`${themeClasses.text}`}>{new Date(blockchainId.lastVerified).toLocaleString()}</p>
                </div>
                
                <button className="w-full mt-3 text-blue-500 text-sm font-medium">
                  View Blockchain Passport Details
                </button>
              </div>
              
              <SecurityStatus />
              
              <div className={`${themeClasses.card} rounded-lg shadow divide-y ${themeClasses.divider}`}>
                <div className={`p-4 flex justify-between cursor-pointer ${themeClasses.text}`}>
                  <span>Personal Information</span>
                  <span>→</span>
                </div>
                <div 
                  className={`p-4 flex justify-between items-center cursor-pointer ${themeClasses.text}`}
                  onClick={() => navigateTo("securitySettings")}
                >
                  <span>Security Settings</span>
                  <span>→</span>
                </div>
                <div 
                  className={`p-4 flex justify-between cursor-pointer ${themeClasses.text}`}
                  onClick={() => navigateTo("fundingSources")}
                >
                  <span>Funding Sources</span>
                  <span>→</span>
                </div>
                <div className={`p-4 flex justify-between cursor-pointer ${themeClasses.text}`}>
                  <span>Notifications</span>
                  <span>→</span>
                </div>
                <div className={`p-4 flex justify-between cursor-pointer ${themeClasses.text}`}>
                  <span>Privacy & Data</span>
                  <span>→</span>
                </div>
                <div className={`p-4 flex justify-between cursor-pointer ${themeClasses.text}`}>
                  <span>Help & Support</span>
                  <span>→</span>
                </div>
                <div className={`p-4 flex justify-between cursor-pointer ${themeClasses.text}`}>
                  <span>About App</span>
                  <span>→</span>
                </div>
              </div>
              
              <button 
                className="w-full border-2 border-red-500 text-red-500 py-3 rounded-full mt-8"
                onClick={() => navigateTo("welcome")}
              >
                Log Out
              </button>
            </div>
            
            <BottomNav />
          </div>
        );
        
      case "biometricAuth":
        return (
          <div className={`flex flex-col h-full ${themeClasses.card}`}>
            <Header title="Authentication Required" />
            
            <div className="flex-1 p-6 flex flex-col items-center justify-center">
              <div className={`w-24 h-24 rounded-full ${isAuthenticating ? 'bg-blue-100 animate-pulse' : 'bg-blue-100'} flex items-center justify-center mb-6`}>
                {biometricType === "fingerprint" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <path d="M12 11c0 3.5-2.5 6.5-6 7"></path>
                    <path d="M12 11V3"></path>
                    <path d="M12 11c0 3.5 2.5 6.5 6 7"></path>
                    <path d="M16 7a4 4 0 0 0-8 0"></path>
                    <path d="M8 15a4 4 0 0 0 8 0"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <circle cx="12" cy="8" r="5"></circle>
                    <path d="M20 21a8 8 0 0 0-16 0"></path>
                  </svg>
                )}
              </div>
              
              <h2 className={`text-xl font-semibold mb-3 text-center ${themeClasses.text}`}>
                {isAuthenticating 
                  ? "Authenticating..." 
                  : biometricType === "fingerprint" 
                    ? "Touch Fingerprint Sensor" 
                    : "Face Recognition Required"
                }
              </h2>
              
              <p className={`${themeClasses.subtext} mb-8 text-center`}>
                {isAuthenticating 
                  ? "Please wait while we verify your identity" 
                  : "For your security, biometric authentication is required"
                }
              </p>
              
              {!isAuthenticating && (
                <>
                  <button 
                    className="w-full bg-blue-500 text-white py-3 rounded-full mb-3"
                    onClick={authenticateWithBiometrics}
                  >
                    {biometricType === "fingerprint" ? "Scan Fingerprint" : "Scan Face"}
                  </button>
                  
                  <div className="flex items-center mt-6 mb-2">
                    <button 
                      className="text-blue-500"
                      onClick={() => setBiometricType(biometricType === "fingerprint" ? "face" : "fingerprint")}
                    >
                      Switch to {biometricType === "fingerprint" ? "Face ID" : "Fingerprint"}
                    </button>
                  </div>
                  
                  <button 
                    className={themeClasses.subtext + " mt-4"}
                    onClick={() => navigateTo("dashboard")}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        );
      
      case "securitySettings":
        return (
          <div className={`flex flex-col h-full ${themeClasses.card}`}>
            <Header title="Security Settings" />
            
            <div className="flex-1 p-4 pb-16">
              <div className={`${themeClasses.card} rounded-lg shadow divide-y ${themeClasses.divider} mb-6`}>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${themeClasses.text}`}>Biometric Authentication</h3>
                    <p className={`text-xs ${themeClasses.subtext} mt-1`}>Use your fingerprint or face to secure the app</p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input 
                      type="checkbox" 
                      className="opacity-0 w-0 h-0" 
                      checked={isBiometricEnabled}
                      onChange={() => setIsBiometricEnabled(!isBiometricEnabled)}
                      id="biometric-toggle"
                    />
                    <label 
                      htmlFor="biometric-toggle"
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 ${isBiometricEnabled ? 'bg-green-400' : 'bg-gray-300'}`}
                    >
                      <span 
                        className={`absolute h-5 w-5 rounded-full bg-white transition-transform duration-300 ${isBiometricEnabled ? 'transform translate-x-6' : 'transform translate-x-1'}`}
                        style={{top: '0.125rem'}}
                      ></span>
                    </label>
                  </div>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${themeClasses.text}`}>Biometric Method</h3>
                    <p className={`text-xs ${themeClasses.subtext} mt-1`}>Select your preferred authentication method</p>
                  </div>
                  <select 
                    className={`border ${themeClasses.divider} rounded px-2 py-1 ${themeClasses.input}`}
                    value={biometricType}
                    onChange={(e) => setBiometricType(e.target.value)}
                    disabled={!isBiometricEnabled}
                  >
                    <option value="fingerprint">Fingerprint</option>
                    <option value="face">Face ID</option>
                  </select>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium ${themeClasses.text}`}>Transaction Notifications</h3>
                      <p className={`text-xs ${themeClasses.subtext} mt-1`}>Get notified for all transactions</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input 
                        type="checkbox" 
                        className="opacity-0 w-0 h-0" 
                        checked={true}
                        id="notification-toggle"
                      />
                      <label 
                        htmlFor="notification-toggle"
                        className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full bg-green-400"
                      >
                        <span 
                          className="absolute h-5 w-5 rounded-full bg-white transform translate-x-6"
                          style={{top: '0.125rem'}}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className={`font-medium ${themeClasses.text}`}>PIN Code</h3>
                  <p className={`text-xs ${themeClasses.subtext} mt-1`}>Use a PIN as backup authentication</p>
                </div>
                
                <div className="p-4">
                  <h3 className={`font-medium ${themeClasses.text}`}>Password Settings</h3>
                  <p className={`text-xs ${themeClasses.subtext} mt-1`}>Change your account password</p>
                </div>
                
                <div className="p-4">
                  <h3 className={`font-medium ${themeClasses.text}`}>Transaction Limits</h3>
                  <p className={`text-xs ${themeClasses.subtext} mt-1`}>Set maximum transaction amounts</p>
                </div>
                
                <div className="p-4">
                  <h3 className={`font-medium ${themeClasses.text}`}>Two-Factor Authentication</h3>
                  <p className={`text-xs ${themeClasses.subtext} mt-1`}>Add an extra layer of security</p>
                </div>
              </div>
              
              <div className={`mt-6 ${darkMode ? 'bg-blue-900' : 'bg-blue-50'} p-4 rounded-lg ${darkMode ? 'border-blue-800' : 'border border-blue-100'}`}>
                <h3 className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} text-sm font-medium mb-2`}>Blockchain Security</h3>
                <p className={`${darkMode ? 'text-blue-200' : 'text-blue-600'} text-xs`}>Your biometric data is encrypted and stored securely using blockchain technology, ensuring your information cannot be compromised.</p>
              </div>
            </div>
            
            <BottomNav />
          </div>
        );
        
      default:
        return (
          <div className={`p-6 text-center ${themeClasses.card}`}>
            <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text}`}>Screen Not Implemented</h2>
            <p className={`${themeClasses.subtext} mb-6`}>This screen is under development</p>
            <PrimaryButton 
              text="Go to Dashboard" 
              onClick={() => navigateTo("dashboard")}
            />
          </div>
        );
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${themeClasses.app} p-4`}>
      <div className="w-full max-w-md h-[640px] bg-white rounded-3xl shadow-lg overflow-hidden relative">
        <div className={`h-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {renderScreen()}
          <Toast />
        </div>
      </div>
    </div>
  );
};

export default App;
