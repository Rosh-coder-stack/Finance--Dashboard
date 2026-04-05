import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import Transaction from "../components/Transaction";
import Insights from "../components/Insights";

import BalanceChart from "../charts/BalanceChart";
import SpendingBreakdown from "../charts/SpendingBreakdown";

// Default mock data
const DEFAULT_TRANSACTIONS = [
  { date: "13 Mar", category: "Salary", amount: 50000, type: "Income" },
  { date: "12 Mar", category: "Food", amount: 450, type: "Expense" },
];

export default function Dashboard() {

  const [role, setRole] = useState("admin");
  
  // Load dark mode preference from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [summary, setSummary] = useState({
    income: 120000,
    expense: 35000,
    balance: 85000,
  });

  // Load transactions from localStorage or use defaults
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });
  
  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Calculate summary from transactions whenever they load or change
  useEffect(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === "Income") income += t.amount;
      else expense += t.amount;
    });

    setSummary({
      income,
      expense,
      balance: income - expense,
    });
  }, [transactions]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  return (
    <div className="p-3 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen space-y-6">

      <Navbar role={role} setRole={setRole} darkMode={darkMode} setDarkMode={setDarkMode} />

      <StatCard data={summary} darkMode={darkMode} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BalanceChart transactions={transactions} initialBalance={summary.balance} darkMode={darkMode} />
        <SpendingBreakdown transactions={transactions} darkMode={darkMode} />
      </div>

      {/* TABLE + INSIGHTS SIDE BY SIDE - RESPONSIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2">
          <Transaction role={role} setSummary={setSummary} transactions={transactions} setTransactions={setTransactions} darkMode={darkMode} />
        </div>

        <Insights transactions={transactions} darkMode={darkMode} />

      </div>

    </div>
  );
}