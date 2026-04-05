import {
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

export default function SpendingBreakdown({ transactions = [], darkMode }) {
  
  // Calculate spending by category from transactions
  const calculateSpendingByCategory = (txns) => {
    const categories = {};
    let totalExpense = 0;
    
    txns.forEach(t => {
      if (t.type === "Expense") {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
        totalExpense += t.amount;
      }
    });
    
    if (totalExpense === 0) {
      return [];
    }
    
    // Convert to percentages
    return Object.entries(categories)
      .map(([name, amount]) => ({
        name,
        value: Math.round((amount / totalExpense) * 100),
        amount
      }))
      .sort((a, b) => b.value - a.value);
  };

  const data = calculateSpendingByCategory(transactions);
  
  // Show message if no expenses
  if (data.length === 0) {
    return (
      <div className={`p-6 rounded-2xl shadow-md flex items-center justify-center h-80 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No expenses yet. Add transactions to see the breakdown.</p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl shadow-md flex justify-between items-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      
      {/* LEFT: PIE */}
      <div className="w-1/2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={40}
              outerRadius={80}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={darkMode ? { stroke: "#9ca3af" } : {}}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* RIGHT: LEGEND */}
      <div className="w-1/2 space-y-3">
        <h2 className={`text-lg font-semibold mb-2 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
          Spending Breakdown
        </h2>

        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
              {item.name} - ₹{item.amount.toLocaleString()} ({item.value}%)
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}