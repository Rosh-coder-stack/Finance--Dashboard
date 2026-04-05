#  Finance Dashboard

A modern, responsive financial management dashboard built with **React + Vite + Tailwind CSS**. Track income, expenses, and gain insights into your spending patterns with an intuitive interface.

![Status](https://img.shields.io/badge/Status-Complete-success) ![React](https://img.shields.io/badge/React-19.2-blue) ![Vite](https://img.shields.io/badge/Vite-8.0-purple) ![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

### Dashboard Overview
- **Summary Cards** - Quick view of Total Balance, Income, and Expenses
- **Balance Trend Chart** - LineChart visualizing your balance over time
- **Spending Breakdown** - PieChart showing expense distribution by category
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Transaction Management
- **Add Transactions** - Admin users can add new income/expense entries (with date picker)
- **Search Transactions** - Multi-field search by category, date, or amount
- **Filter by Type** - Show All, Income-only, or Expense-only transactions
- **Smart Sorting** - Sort by Newest or Oldest date
- **Beautiful Table** - Clean, modern transaction display with color-coded types

### Smart Insights
-  **Top Spending Category** - Identify your highest expense category
-  **Total & Average Expenses** - Quick spending metrics
-  **Savings Rate** - Percentage of income you're saving
-  **Highest Expense Month** - Track monthly spending patterns
-  **Budget Alerts** - Warnings when overspending, congratulations when saving well

### Role-Based UI
- **Admin Mode** - Add/manage transactions with full access
- **Viewer Mode** - Read-only access to view data

---

##  Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI Framework |
| **Vite 8** | Build Tool (Fast Development) |
| **Tailwind CSS 4** | Styling & Responsive Design |
| **Recharts 3** | Chart Visualizations |
| **Lucide React** | Beautiful Icons |
| **React Icons** | Additional Icon Library |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:5173
```

**Dev Server Running?** Look for output like:
```
VITE v8.0.3 ready in 420 ms
➜  Local:   http://localhost:5173/
```

### Build for Production

```bash
npm run build          # Create optimized build
npm run preview        # Preview production build
npm run lint           # Check code quality
```

---

## How to Use

### Adding Transactions (Admin Only)

1. **Switch to Admin Mode** - Use the Role dropdown in navbar (top-right)
2. **Fill the Form:**
   - **Date** - Click to open calendar picker (auto-converts to "5 Apr" format)
   - **Category** - Enter any category (Food, Salary, Shopping, etc.)
   - **Amount** - Enter the amount
   - **Type** - Select Income or Expense
3. **Click Add** - Transaction appears in the table instantly
4. **Charts Update** - Balance and Spending charts recalculate automatically

### Searching & Filtering

- **Search Box** - Type to find by:
  - Category name (e.g., "food")
  - Date (e.g., "17 Mar")
  - Amount (e.g., "450")

- **Filter by Type** - Show only Income/Expense
- **Sort** - Oldest First or Newest First
- **Combine Filters** - Use multiple filters together

### Understanding Insights

- **Top Spending Category** - Which expense category has the highest single transaction
- **Total Expenses** - Sum of all expenses; Average shows per-transaction average
- **Savings Rate** - How much of your income you're keeping (higher is better)
- **Highest Expense Month** - Which month had the most spending
- **Budget Alerts** - Automatic warnings (overspending) or congratulations (saving well)

---

##  Project Structure

```
finance-dashboard/
├── src/
│   ├── components/
│   │   ├── Insights.jsx          # Smart insights with metrics
│   │   ├── Navbar.jsx            # Header with role selector
│   │   ├── StatCard.jsx          # Summary cards
│   │   └── Transaction.jsx       # Transaction table + form
│   ├── charts/
│   │   ├── BalanceChart.jsx      # Line chart of balance trend
│   │   └── SpendingBreakdown.jsx # Pie chart of expenses
│   ├── pages/
│   │   └── Dashboard.jsx         # Main page (coordinator)
│   ├── App.jsx                   # Root component
│   ├── index.css                 # Global styles
│   └── main.jsx                  # Entry point
├── public/                       # Static assets
├── package.json                  # Dependencies & scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS settings
├── eslint.config.js             # Code quality rules
└── README.md                    # This file
```

---

##  Key Design Decisions

### 1. **State Management**
- Using React `useState` at Dashboard level for simplicity
- Props drilled to child components
- Future: Could migrate to Context API or Redux for larger apps

### 2. **Data Flow**
- Dashboard is the source of truth for transactions
- All mutations flow through `setTransactions`
- Charts and Insights read from the same transaction array

### 3. **Responsive Design**
- Tailwind CSS breakpoints: `sm:` (640px), `lg:` (1024px)
- Mobile-first approach
- Grid layouts collapse on small screens
- Table has horizontal scroll on mobile

### 4. **Date Handling**
- Input format: "DD MMM" (e.g., "5 Apr")
- Date picker converts YYYY-MM-DD ↔ DD MMM
- All calculations assume 2026 as year

### 5. **Empty States**
- Dashboard shows helpful messages when no data exists
- Filters clearly communicate when no results match
- Guidance text suggests next steps

---

##  Design Highlights

### Colors
- **Blue** - Primary actions, Income, Charts
- **Green** - Income, Savings, Success alerts
- **Red** - Expenses, Warnings
- **Gray** - Neutral, Backgrounds

### Typography
- **Headings** - Semibold, clear hierarchy
- **Body** - Regular, readable
- **Small text** - Subtle gray for secondary info

### Components
- **Cards** - White with 2xl shadows, rounded corners
- **Buttons** - Blue background, white text, hover effects
- **Inputs** - Border style, good contrast
- **Icons** - From Lucide React for consistency

---

##  Data Flow Diagram

```
Dashboard (Source of Truth)
    ├── transactions state
    ├── summary state
    ├── role state
    │
    ├─→ Navbar (reads role, updates role)
    ├─→ StatCard (reads summary)
    ├─→ BalanceChart (reads & calculates from transactions)
    ├─→ SpendingBreakdown (reads & calculates from transactions)
    ├─→ Transaction (reads/updates transactions, updates summary)
    └─→ Insights (reads & calculates from transactions)
```

---

##  Features in Detail

### Charts

#### Balance Trend
- **Type** - Line Chart
- **Data** - Running balance calculated from transactions
- **Updates** - Real-time as transactions are added
- **Responsive** - Scales based on screen size

#### Spending Breakdown
- **Type** - Donut/Pie Chart
- **Data** - Percentage distribution by category
- **Features** - Displays amount and percentage for each category
- **Dynamic** - Categories auto-detected from transactions

### Insights Algorithm

1. **Group expenses by category** - Find highest amount
2. **Calculate average** - Total expenses ÷ transaction count
3. **Compute savings rate** - (Income - Expenses) / Income × 100
4. **Track monthly** - Group expenses by month, find highest
5. **Generate alerts** - Warn if overspending, congratulate if saving >30%

---

##  Known Limitations

1. **Backend** - Uses mock data only (localStorage would add persistence)
2. **Date Range** - Assumes 2026 as year (fixable with full date format)
3. **Categories** - Free-form text (could use predefined list)
4. **Edit/Delete** - Cannot modify transactions after creation
5. **Multi-year** - Cannot compare across multiple years

---

##  Future Enhancements

### High Priority
- [ ] Local storage persistence (save data on refresh)
- [ ] Edit/Delete transaction functionality
- [ ] Date range filters
- [ ] Monthly comparison view

### Medium Priority
- [ ] Dark mode toggle
- [ ] CSV/JSON export
- [ ] Budget limit setting
- [ ] Recurring transactions

### Low Priority
- [ ] Animations & transitions
- [ ] Multi-user support
- [ ] Backend API integration
- [ ] Mobile app version

---

## 📱 Responsiveness

Tested and working on:
-  Desktop (1920px, 1440px, 1024px)
-  Tablet (768px, 812px)
-  Mobile (375px, 414px, 480px)

**Responsive Features:**
- Single column layout on mobile
- Two-column charts on tablet
- Three-column layout on desktop
- Touch-friendly buttons and inputs
- Horizontal scroll for tables on small screens

---

##  Security Notes

 **Not Production Ready** - This is a demo application:
- No authentication/authorization
- Data stored in memory only
- No API security
- No input sanitization

For production, add:
- User authentication
- Backend validation
- Database with proper security
- Rate limiting
- HTTPS

---

##  License

MIT License - Feel free to use for personal or commercial projects

---

##  Author

Built as a demonstration of modern React development practices.

---

##  Contributing

Suggestions welcome! Areas for improvement:
- Performance optimization
- Accessibility (a11y) improvements
- Unit/E2E testing
- Code documentation

---

##  Support

If you encounter issues:

1. **Clear browser cache** - `Ctrl+Shift+Delete`
2. **Check console** - Press `F12`, look for error messages
3. **Restart dev server** - Kill and `npm run dev`
4. **Reset data** - Refresh the page (data is not persistent)

---

**Happy budgeting!**
