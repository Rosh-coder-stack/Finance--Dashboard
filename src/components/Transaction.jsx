import { useState } from "react";
import { Download, Search, ChevronDown } from "lucide-react";

// Helper function to convert "5 Apr" to "2026-04-05" format
const convertToDateInput = (dateString) => {
  if (!dateString) return "";
  
  const [day, month] = dateString.split(" ");
  const currentYear = new Date().getFullYear();
  const dateObj = new Date(`${month} ${day}, ${currentYear}`);
  
  // Format as YYYY-MM-DD for date input
  const year = dateObj.getFullYear();
  const monthNum = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dayNum = String(dateObj.getDate()).padStart(2, "0");
  
  return `${year}-${monthNum}-${dayNum}`;
};

export default function Transaction({ role, setSummary, transactions, setTransactions, darkMode }) {

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [showFilters, setShowFilters] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const [form, setForm] = useState({
    date: "",
    category: "",
    amount: "",
    type: "Income",
  });

  // Get unique categories from transactions
  const uniqueCategories = [...new Set(transactions.map(t => t.category))];

  // Apply filters and sorting
  let filtered = transactions.filter((t) => {
    // Search filter
    const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase()) ||
                         t.date.includes(search) ||
                         t.amount.toString().includes(search);
    
    // Type filter
    const matchesType = filterType === "All" || t.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Sort by date
  filtered = filtered.sort((a, b) => {
    const monthMap = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
    
    const [dayA, monthA] = a.date.split(" ");
    const [dayB, monthB] = b.date.split(" ");
    
    const dateA = new Date(2026, monthMap[monthA] - 1, dayA);
    const dateB = new Date(2026, monthMap[monthB] - 1, dayB);
    
    return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
  });

  const handleAdd = () => {
    if (!form.amount || !form.category || !form.date) {
      alert("Please fill in all fields including the date");
      return;
    }

    const newTx = {
      ...form,
      amount: Number(form.amount),
    };

    const updated = [...transactions, newTx];
    setTransactions(updated);

    let income = 0;
    let expense = 0;

    updated.forEach((t) => {
      if (t.type === "Income") income += t.amount;
      else expense += t.amount;
    });

    setSummary({
      income,
      expense,
      balance: income - expense,
    });

    setForm({ date: "", category: "", amount: "", type: "Income" });
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      const updated = transactions.filter((_, i) => i !== index);
      setTransactions(updated);
    }
  };

  const handleEditStart = (index) => {
    setEditingIndex(index);
    setEditForm({ ...transactions[index] });
  };

  const handleEditSave = () => {
    if (!editForm.amount || !editForm.category || !editForm.date) {
      alert("Please fill in all fields");
      return;
    }

    const updated = transactions.map((t, i) => 
      i === editingIndex ? { ...editForm, amount: Number(editForm.amount) } : t
    );
    setTransactions(updated);
    setEditingIndex(null);
    setEditForm(null);
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditForm(null);
  };

  // CSV Export Function
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export");
      return;
    }

    // CSV Header
    const headers = ["Date", "Category", "Amount", "Type"];
    
    // CSV Rows
    const rows = transactions.map(t => [
      t.date,
      t.category,
      t.amount.toString(),
      t.type
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Transactions</h2>

        <button
          onClick={handleExportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
          title="Download transactions as CSV"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* COLLAPSIBLE FILTER BUTTON */}
      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            showFilters
              ? darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-700"
              : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <Search className="w-4 h-4" />
          Search & Filter
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {/* FILTER PANEL - HIDDEN BY DEFAULT */}
        {showFilters && (
          <div className={`mt-3 p-4 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">

              <input
                placeholder="Search by category, date, or amount..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`border p-2 rounded-lg text-sm w-full sm:flex-1 ${darkMode ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" : "bg-white border-gray-300 text-black"}`}
              />

              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`border p-2 rounded-lg text-sm ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-gray-300 text-black"}`}
              >
                <option value="All">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>

              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={`border p-2 rounded-lg text-sm ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-gray-300 text-black"}`}
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
              </select>

              {(search || filterType !== "All" || sortOrder !== "Newest") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilterType("All");
                    setSortOrder("Newest");
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
                  title="Clear all filters"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ADMIN FORM */}
      {role === "admin" && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 flex-wrap">

          <input
            type="date"
            value={form.date ? convertToDateInput(form.date) : ""}
            onChange={(e) => {
              // Convert "2026-04-05" to "5 Apr"
              const date = new Date(e.target.value);
              const day = date.getDate();
              const month = date.toLocaleString('en-US', { month: 'short' });
              const dateString = `${day} ${month}`;
              setForm({ ...form, date: dateString });
            }}
            className={`border p-2 rounded-lg text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={`border p-2 rounded-lg text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-black"}`}
          />

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className={`border p-2 rounded-lg text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-black"}`}
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={`border p-2 rounded-lg text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          >
            <option>Income</option>
            <option>Expense</option>
          </select>

          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
          >
            Add
          </button>

        </div>
      )}

      {/* TABLE - RESPONSIVE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">

          <thead className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <tr className={darkMode ? "text-gray-300" : "text-gray-600"}>
              <th className="p-2 sm:p-3">Date</th>
              <th className="p-2 sm:p-3">Category</th>
              <th className="p-2 sm:p-3">Amount</th>
              <th className="p-2 sm:p-3">Type</th>
              {role === "admin" && <th className="p-2 sm:p-3">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((t, displayIndex) => {
                // Find actual index in original transactions array
                const actualIndex = transactions.indexOf(t);
                const isEditing = editingIndex === actualIndex;

                return (
                  <tr key={displayIndex} className={`border-t ${isEditing ? (darkMode ? "bg-blue-900" : "bg-blue-50") : (darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50")} transition ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {isEditing ? (
                      <>
                        <td className="p-2 sm:p-3">
                          <input
                            type="date"
                            value={editForm.date ? convertToDateInput(editForm.date) : ""}
                            onChange={(e) => {
                              const date = new Date(e.target.value);
                              const day = date.getDate();
                              const month = date.toLocaleString('en-US', { month: 'short' });
                              setEditForm({ ...editForm, date: `${day} ${month}` });
                            }}
                            className={`border p-1 rounded text-xs w-full ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-gray-300 text-black"}`}
                          />
                        </td>
                        <td className="p-2 sm:p-3">
                          <input
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className={`border p-1 rounded text-xs w-full ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-gray-300 text-black"}`}
                          />
                        </td>
                        <td className="p-2 sm:p-3">
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                            className={`border p-1 rounded text-xs w-full ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-gray-300 text-black"}`}
                          />
                        </td>
                        <td className="p-2 sm:p-3">
                          <select
                            value={editForm.type}
                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                            className={`border p-1 rounded text-xs w-full ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-gray-300 text-black"}`}
                          >
                            <option>Income</option>
                            <option>Expense</option>
                          </select>
                        </td>
                        <td className="p-2 sm:p-3 flex gap-2">
                          <button
                            onClick={handleEditSave}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-2 sm:p-3">{t.date}</td>
                        <td className="p-2 sm:p-3">{t.category}</td>
                        <td className="p-2 sm:p-3">₹{t.amount.toLocaleString()}</td>
                        <td
                          className={`p-2 sm:p-3 ${
                            t.type === "Income"
                              ? "text-green-600 font-semibold"
                              : "text-red-500 font-semibold"
                          }`}
                        >
                          {t.type}
                        </td>
                        {role === "admin" && (
                          <td className="p-2 sm:p-3 flex gap-2">
                            <button
                              onClick={() => handleEditStart(actualIndex)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(actualIndex)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={role === "admin" ? "5" : "4"} className={`p-4 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <div className="py-4">
                    <p className="text-base font-medium">No transactions found</p>
                    <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      {transactions.length === 0 
                        ? "Start by adding your first transaction" 
                        : "Try adjusting your filters"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}