import { Moon, Sun } from "lucide-react";

export default function Navbar({ role, setRole, darkMode, setDarkMode }) {
  
  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all transactions? This cannot be undone.")) {
      localStorage.removeItem("transactions");
      window.location.reload();
    }
  };

  return (
    <div className="bg-black dark:bg-gray-950 p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
      <h1 className="text-white text-lg sm:text-xl font-semibold">💰 Finance Dashboard</h1>
      
      <div className="flex gap-3 items-center">
        <span className="text-white text-sm">Role:</span>
        <select 
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-2 rounded text-black text-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
          title={`Switch to ${darkMode ? "light" : "dark"} mode`}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
          title="Clear all transaction data"
        >
          Reset Data
        </button>
      </div>
    </div>
  );
}