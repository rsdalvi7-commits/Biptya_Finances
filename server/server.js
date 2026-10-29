/**
 * SUMMARY:
 * This is the main starting file (entry point) for the backend server.
 * It does 4 main things:
 * 1. Sets up the Express application and basic middlewares (CORS, JSON parser).
 * 2. Connects to the MongoDB database using Mongoose.
 * 3. Mounts the API route handlers for authentication (/api/auth) and transactions (/api/transactions).
 * 4. Starts listening for incoming web requests on the specified PORT (default 5000).
 */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';

// Load secret variables from .env file into process.env
dotenv.config();

// Create the Express app instance
const app = express();

// Choose port from environment or fallback to 5000
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- MIDDLEWARES ---
// Enable CORS so the React frontend on another port/domain can talk to this server
app.use(cors());

// Automatically parse incoming JSON data in request bodies
app.use(express.json());

// --- ROUTES ---
// Mount authentication routes (register, login, me)
app.use('/api/auth', authRoutes);

// Mount transaction routes (get, add, edit, delete transactions)
app.use('/api/transactions', transactionRoutes);

// Simple health check route to verify server status in browser
app.get('/', (req, res) => {
  res.json({
    name: 'Biptya Finances API',
    status: 'running',
    version: '1.0.0',
  });
});

// Handle requests to routes that don't exist (404 Not Found)
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Catch-all error handler for unexpected server errors (500)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// --- DATABASE CONNECTION & START SERVER ---
// Check that database URL is set before starting
if (!MONGO_URI) {
  console.error('CRITICAL ERROR: MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not defined in environment variables.');
}

// Connect to MongoDB database
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    // Start listening for HTTP requests only after database connection succeeds
    app.listen(PORT, () => {
      console.log(`Biptya Finances Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
