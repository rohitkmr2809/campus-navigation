import { NextResponse } from 'next/server';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { findUserByEmail, createUser } from '@/lib/data-service';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required fields.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const validRoles = ['student', 'faculty', 'visitor'];
    const assignedRole = validRoles.includes(role) ? role : 'student';

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    // Hash password using bcrypt
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: assignedRole,
    });

    // Create JWT token and set HTTP-only cookie
    const token = signToken(newUser);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully.',
        user: {
          id: newUser._id ? newUser._id.toString() : newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during registration.' },
      { status: 500 }
    );
  }
}
