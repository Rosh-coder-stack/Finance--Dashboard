import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ data, darkMode }) {

  const Card = ({ title, value, icon, color }) => (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-md flex items-center gap-4 flex-1 min-w-0 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      
      <div className={`p-3 rounded-xl ${color} flex-shrink-0`}>
        {icon}
      </div>

      <div className="min-w-0">
        <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{title}</p>
        <h2 className={`text-lg sm:text-2xl font-semibold truncate ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
          ₹{value.toLocaleString()}
        </h2>
      </div>

    </div>
  );

  return (
    <div className="flex flex-wrap gap-3 sm:gap-5">
      <Card
        title="Total Balance"
        value={data.balance}
        icon={<Wallet />}
        color="bg-blue-200"
      />

      <Card
        title="Income"
        value={data.income}
        icon={<TrendingUp />}
        color="bg-green-200"
      />

      <Card
        title="Expenses"
        value={data.expense}
        icon={<TrendingDown />}
        color="bg-red-200"
      />
    </div>
  );
}