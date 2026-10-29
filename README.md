# Biptya Finances 💰

A full-stack MERN (MongoDB, Express, React, Node.js) personal expense and budget tracker application with JWT authentication, real-time metrics, interactive data visualizations, and modern responsive UI styled with Tailwind CSS.

---

## 🌟 Key Features

- **User Authentication:** Secure JWT-based authentication with bcrypt password hashing. Protected dashboard routes and automatic token persistence.
- **Financial Summary Cards:** Real-time calculation of **Current Balance**, **Total Income**, and **Total Expenses** with surplus/deficit status.
- **Interactive Data Visualizations (Recharts):**
  - **Pie Chart:** Expense distribution broken down by category (Food, Rent, Salary, Entertainment, Utilities, Other).
  - **Bar Chart:** Direct comparison of total income vs. total expenses.
- **Transaction Management:** Full CRUD (Create, Read, Update, Delete) operations with validation and user-scoped data isolation.
- **Search & Filtering:** Instant live title search and filters by transaction type (Income/Expense) and category.
- **Modern Responsive Design:** Built with React 19, Vite, Tailwind CSS, and Lucide React icons.

---

## 📂 Project Structure

```text
biptya-finances/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, SummaryCards, TransactionForm, TransactionList, ChartsSection, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT management & session state)
│   │   ├── pages/              # Login, Register, Dashboard
│   │   ├── api.js              # Axios instance with JWT interceptor
│   │   ├── App.jsx             # React Router setup & protected routes
│   │   ├── main.jsx            # Application entry
│   │   └── index.css           # Tailwind CSS imports
│   ├── .env.example            # Client environment template
│   ├── vite.config.js          # Vite configuration with Tailwind plugin
│   └── package.json
│
└── server/                     # Node.js + Express + Mongoose Backend
    ├── models/
    │   ├── User.js             # Mongoose User schema (email, hashed password)
    │   └── Transaction.js      # Mongoose Transaction schema
    ├── middleware/
    │   └── auth.js             # JWT verification middleware
    ├── routes/
    │   ├── auth.js             # /api/auth/register, /api/auth/login, /api/auth/me
    │   └── transactions.js     # /api/transactions CRUD endpoints
    ├── .env.example            # Server environment template
    ├── server.js               # Express application entry & MongoDB connection
    ├── test_api.js             # Automated API verification test suite
    └── package.json
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas connection URI)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd biptya-finances/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   A `.env` file has been provided, or copy `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Values in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/biptya_finances
   JWT_SECRET=biptya_finances_secure_jwt_secret_key_2026
   ```

4. Run the server:
   ```bash
   # Development mode with watch:
   npm run dev

   # Or standard start:
   npm start
   ```
   The backend server will run at `http://localhost:5000`.

5. Run automated API verification tests:
   ```bash
   npm test
   ```

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd biptya-finances/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user (email, password) | No |
| `POST` | `/api/auth/login` | Authenticate user & retrieve JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer Token) |

### Transactions (`/api/transactions`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/transactions` | Retrieve all user transactions | Yes (Bearer Token) |
| `POST` | `/api/transactions` | Create transaction (title, amount, type, category, date) | Yes (Bearer Token) |
| `PUT` | `/api/transactions/:id` | Update an existing transaction | Yes (Bearer Token) |
| `DELETE` | `/api/transactions/:id` | Delete a transaction | Yes (Bearer Token) |

---

## 🛡️ Security Features
- **Password Hashing:** Passwords hashed using `bcryptjs` with salt rounds.
- **JWT Protection:** Authorization header verification using `Bearer <token>`.
- **Query Scoping:** Every transaction query (find, update, delete) is strictly filtered by `userId: req.user.id` to prevent cross-account data leakage.
- **Environment Secrets:** Secrets are loaded via `dotenv` and never hardcoded.

