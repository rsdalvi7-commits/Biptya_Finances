/**
 * SUMMARY:
 * This file defines the "User" blueprint (Mongoose Schema) for MongoDB.
 * It specifies what user information is saved in the database:
 * - A unique, valid email address (stored in lowercase without extra spaces).
 * - A securely hashed password (at least 6 characters long).
 * - Automatic createdAt and updatedAt timestamps.
 */

import mongoose from 'mongoose';

// Define the blueprint for each user account document
const userSchema = new mongoose.Schema(
  {
    // User's login email
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Prevents two users from registering with the same email
      trim: true, // Removes accidental spaces around the email
      lowercase: true, // Converts email to lowercase for consistent lookups
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    // User's password (this stores the encrypted bcrypt hash, never plain text)
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' date fields
    timestamps: true,
  }
);

// Create the Mongoose model from the schema
const User = mongoose.model('User', userSchema);

export default User;
