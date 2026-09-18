import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'campus_nav_secret_jwt_key_fallback';
export const AUTH_COOKIE_NAME = 'campus_nav_token';

/**
 * Hash plain text password using bcrypt
 */
export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Compare plain password against stored hash
 */
export async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generate a signed JWT token
 */
export function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verify signed JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Extract authenticated user session from Next.js request cookies or Auth header
 */
export async function getAuthSession(req) {
  try {
    let token = null;

    // 1. Try reading from Request Cookies
    if (req && req.cookies && typeof req.cookies.get === 'function') {
      const cookieObj = req.cookies.get(AUTH_COOKIE_NAME);
      if (cookieObj) token = cookieObj.value;
    }

    // 2. Try Next.js server `cookies()` helper if available
    if (!token) {
      try {
        const cookieStore = cookies();
        const cookieObj = cookieStore.get(AUTH_COOKIE_NAME);
        if (cookieObj) token = cookieObj.value;
      } catch (e) {
        // May be outside Server Component / Route context
      }
    }

    // 3. Fallback to Authorization Header
    if (!token && req && req.headers) {
      const authHeader = req.headers.get
        ? req.headers.get('authorization')
        : req.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    console.error('Error verifying auth session:', error);
    return null;
  }
}

/**
 * Middleware helper for API route handlers to require authentication
 */
export async function requireAuth(req) {
  const session = await getAuthSession(req);
  if (!session) {
    return {
      error: 'Authentication required. Please log in to proceed.',
      status: 401,
      user: null,
    };
  }
  return { user: session, status: 200, error: null };
}

/**
 * Middleware helper for API route handlers to require Admin role
 */
export async function requireAdmin(req) {
  const auth = await requireAuth(req);
  if (auth.error) {
    return auth;
  }
  if (auth.user.role !== 'admin') {
    return {
      error: 'Access denied. Administrator privileges required.',
      status: 403,
      user: null,
    };
  }
  return { user: auth.user, status: 200, error: null };
}
