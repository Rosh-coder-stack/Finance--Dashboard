import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function BalanceChart({ transactions = [], initialBalance = 0, darkMode }) {
  
  // Calculate balance by month from transactions
  const calculateBalanceByMonth = (txns, startingBalance) => {
    const monthData = {};
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Group by month
    txns.forEach(t => {
      const monthName = t.date.split(" ")[1];
      if (!monthData[monthName]) {
        monthData[monthName] = { income: 0, expense: 0 };
      }
      
      if (t.type === "Income") {
        monthData[monthName].income += t.amount;
      } else {
        monthData[monthName].expense += t.amount;
      }
    });
    
    // Get months with data
    const monthsWithData = monthOrder.filter(month => monthData[month]);
    
    if (monthsWithData.length === 0) {
      return [{ month: "Jan", value: startingBalance }];
    }
    
    // Start with initial balance even before first transaction month
    const firstMonth = monthsWithData[0];
    const firstMonthIndex = monthOrder.indexOf(firstMonth);
    
    // Create result array starting from initial balance
    const result = [];
    let runningBalance = startingBalance;
    
    // If first transaction is not in January, add starting point
    if (firstMonthIndex > 0) {
      result.push({ month: monthOrder[firstMonthIndex - 1], value: startingBalance });
    }
    
    // Add months with transactions
    monthsWithData.forEach(month => {
      const { income, expense } = monthData[month];
      runningBalance += income - expense;
      result.push({ month, value: runningBalance });
    });
    
    return result;
  };

  const data = calculateBalanceByMonth(transactions, initialBalance);

  return (
    <div className={`p-6 rounded-2xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Balance Trend</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
          <XAxis dataKey="month" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
          <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={darkMode ? { backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" } : {}} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}