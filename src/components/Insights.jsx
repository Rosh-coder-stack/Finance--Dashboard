import { TrendingUp, TrendingDown, BarChart3, AlertCircle, CheckCircle2, Calendar } from "lucide-react";

export default function Insights({ transactions = [], darkMode }) {

  // Calculate all insights
  let maxAmount = 0;
  let maxCategory = "";
  let totalExpense = 0;
  let totalIncome = 0;
  let expenseCount = 0;
  const monthlyExpenses = {};

  transactions.forEach(t => {
    if (t.type === "Expense") {
      totalExpense += t.amount;
      expenseCount += 1;
      if (t.amount > maxAmount) {
        maxAmount = t.amount;
        maxCategory = t.category;
      }
      
      // Track monthly expenses
      const month = t.date.split(" ")[1];
      monthlyExpenses[month] = (monthlyExpenses[month] || 0) + t.amount;
    } else if (t.type === "Income") {
      totalIncome += t.amount;
    }
  });

  const averageExpense = expenseCount > 0 ? Math.round(totalExpense / expenseCount) : 0;
  
  // Calculate budget status
  const isOverspending = totalExpense > totalIncome;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  // Get highest expense month
  const highestMonth = Object.entries(monthlyExpenses).reduce(
    (a, b) => (a[1] > b[1] ? a : b),
    ["N/A", 0]
  );

  if (transactions.length === 0) {
    return (
      <div className={`p-6 rounded-2xl shadow-md h-full flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <p className={`text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          No transactions yet. Add some to see insights!
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h2 className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Insights</h2>
      </div>

      <div className="space-y-4 text-sm">
        
        {/* Highest Spending */}
        <div className={`pb-3 border-b ${darkMode ? "border-gray-700" : ""}`}>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Top Spending Category</p>
          <p className="text-lg font-bold text-red-600">{maxCategory || "N/A"}</p>
          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>₹{maxAmount.toLocaleString()}</p>
        </div>

        {/* Total & Average */}
        <div className={`pb-3 border-b ${darkMode ? "border-gray-700" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Total Expenses</p>
          </div>
          <p className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>₹{totalExpense.toLocaleString()}</p>
          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Avg: ₹{averageExpense.toLocaleString()}</p>
        </div>

        {/* Savings Rate */}
        <div className={`pb-3 border-b ${darkMode ? "border-gray-700" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Savings Rate</p>
          </div>
          <p className={`text-lg font-bold ${savingsRate > 0 ? "text-green-600" : "text-red-600"}`}>
            {savingsRate}%
          </p>
          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
            {savingsRate > 0 ? "Saving money!" : "Overspending"}
          </p>
        </div>

        {/* Highest Month */}
        <div className={`pb-3 border-b ${darkMode ? "border-gray-700" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-purple-600" />
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Highest Expense Month</p>
          </div>
          <p className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>{highestMonth[0]}</p>
          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>₹{highestMonth[1].toLocaleString()}</p>
        </div>

        {/* Budget Warning */}
        {isOverspending && (
          <div className={`border p-3 rounded-lg flex gap-2 ${darkMode ? "bg-red-900 border-red-800" : "bg-red-50 border-red-200"}`}>
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`font-semibold text-xs ${darkMode ? "text-red-400" : "text-red-700"}`}>Budget Alert</p>
              <p className={`text-xs ${darkMode ? "text-red-400" : "text-red-600"}`}>You're spending more than earning!</p>
            </div>
          </div>
        )}

        {!isOverspending && savingsRate > 30 && (
          <div className={`border p-3 rounded-lg flex gap-2 ${darkMode ? "bg-green-900 border-green-800" : "bg-green-50 border-green-200"}`}>
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`font-semibold text-xs ${darkMode ? "text-green-400" : "text-green-700"}`}>Great Job!</p>
              <p className={`text-xs ${darkMode ? "text-green-400" : "text-green-600"}`}>You're saving well. Keep it up!</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}