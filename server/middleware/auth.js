/**
 * SUMMARY:
 * This is the authentication security gatekeeper (middleware).
 * For protected routes, it checks if the client sent a valid JWT (JSON Web Token)
 * in the HTTP "Authorization" header:
 * - If token is valid: Decodes the user's ID, attaches it to `req.user`, and lets the request continue.
 * - If token is missing, expired, or invalid: Blocks the request immediately with a 401 Unauthorized status.
 */

import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // 1. Read the 'Authorization' header from the incoming request
    const authHeader = req.header('Authorization') || req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header, access denied' });
    }

    // 2. Extract the actual token string (removes "Bearer " prefix if present)
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token) {
      return res.status(401).json({ message: 'No token provided, access denied' });
    }

    // 3. Ensure the server's secret signing key is configured
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not configured in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // 4. Verify the cryptographic signature of the token using JWT_SECRET
    const decoded = jwt.verify(token, secret);

    // 5. Attach the decoded user ID so subsequent route handlers know who is making the request
    req.user = { id: decoded.id };

    // 6. Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Return friendly messages if the token expired or is counterfeit
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired, please log in again' });
    }
    return res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};

export default auth;
