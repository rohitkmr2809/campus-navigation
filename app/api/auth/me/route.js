export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { findUserById } from '@/lib/data-service';

export async function GET(request) {
  try {
    const session = await getAuthSession(request);

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const user = await findUserById(session.id);

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user._id ? user._id.toString() : user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session Check Error:', error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
