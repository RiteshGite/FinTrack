# 💰 Finance Management Application

A personal finance management platform to track income, expenses, and visualize spending patterns with an interactive dashboard.

## 🎯 Features

- Email/Password & Google OAuth authentication
- Add, edit, delete transactions
- Filter transactions by type, category, date range
- Monthly income/expense/balance statistics
- Category-wise pie chart visualization (current month only)
- Custom category creation
- CSV export of all transactions
- Responsive design with Bootstrap 5 & custom CSS
- Smooth animations with Framer Motion

## 🛠 Tech Stack

**Frontend:** React 18, Vite, React Router, Axios, Recharts, Bootstrap 5, Framer Motion, date-fns  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Google Auth  
**Styling:** Custom CSS with CSS variables (not Tailwind or Bootstrap styling)

## 📁 Project Structure

```
Finance Management/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Auth & transaction logic
│   ├── models/          # User, Transaction, Category schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # JWT verification
│   └── server.js        # Express app
│
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, Stats, Dashboard, Forms, Charts
    │   ├── pages/       # Home, Login, Signup, Dashboard, 404
    │   ├── context/     # Auth & Theme contexts
    │   ├── hooks/       # useAuth, useTransactions
    │   ├── services/    # API calls
    │   └── styles/      # global.css
    └── index.html
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ 
- MongoDB (local or MongoDB Atlas)
- Google OAuth credentials

### Backend Setup
```bash
cd backend
npm install
# Create .env file:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/finance_management
# JWT_SECRET=your_secret_key_min_32_chars
# GOOGLE_CLIENT_ID=your_google_client_id
# FRONTEND_URL=http://localhost:3000

npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env.local file:
# VITE_API_BASE_URL=http://localhost:5000/api
# VITE_GOOGLE_CLIENT_ID=your_google_client_id

npm run dev
# App runs on http://localhost:3000
```

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register user |
| POST | `/auth/login` | Login user |
| POST | `/auth/google` | Google OAuth |
| GET | `/transactions` | Get all transactions (with filters) |
| POST | `/transactions` | Create transaction |
| PUT | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |
| GET | `/transactions/stats/monthly` | Monthly stats (income, expense, balance) - CURRENT MONTH ONLY |
| GET | `/transactions/stats/category` | Category breakdown - CURRENT MONTH ONLY |
| GET | `/transactions/export` | Download CSV |
| GET | `/transactions/categories` | Get user categories |
| POST | `/transactions/categories` | Create custom category |

## 📊 Database Schema

**User:** _id, name, email, password (hashed), googleId, authMethod, timestamps

**Transaction:** _id, userId, type (income/expense), category, amount, description, date, timestamps

**Category:** _id, userId, name, type, timestamps

## 🎨 UI Components

- **Dashboard** - Main container with stats, form, chart, transaction list
- **Stats** - 3 cards showing income/expense/balance (CURRENT MONTH)
- **TransactionForm** - Add transactions with type selector, category dropdown, amount, date
- **TransactionList** - Table with filters, sorting, pagination (20 per page), CSV export
- **CategoryChart** - Pie chart visualization (CURRENT MONTH only)
- **Navbar** - Navigation with user info
- **Auth Forms** - Login/Signup with Google OAuth

## 🔑 Important Features

### Monthly Statistics (Current Month Only)
- Income = Sum of all income transactions this month
- Expense = Sum of all expense transactions this month  
- Balance = Income - Expense
- Pie chart shows category breakdown (current month)

### Complete Transaction History (All Time)
- All transactions stored permanently
- Filter by type, category, date range
- Sort by date, amount, category
- CSV export includes all transactions

### Custom Categories
- Users can create custom categories
- Select "Add Custom Category" in TransactionForm
- Categories are type-specific (income/expense)

## 🌐 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/finance_management
JWT_SECRET=your_secret_key_min_32_chars
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id

```

## 📝 Scripts

**Backend:**
- `npm run dev` - Development server with nodemon
- `npm start` - Production server

**Frontend:**
- `npm run dev` - Development server
- `npm run build` - Production build

## 📄 License

ISC License

---

**Built with React, Node.js, and MongoDB | Happy Money Management! 💰**