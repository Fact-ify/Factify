import { NextResponse } from 'next/server';
import { createInitialAdmin, isAdminSetupRequired } from '@/lib/auth/admin-setup';
import { createSessionToken, setSessionCookie } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    if (!(await isAdminSetupRequired())) {
      return NextResponse.json(
        { error: 'An admin account already exists. Sign in instead.' },
        { status: 403 }
      );
    }

    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const admin = await createInitialAdmin({ email, password, name });

    const token = await createSessionToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      user: { email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'ADMIN_EXISTS') {
        return NextResponse.json(
          { error: 'An admin account already exists. Sign in instead.' },
          { status: 403 }
        );
      }
      if (error.message === 'WEAK_PASSWORD') {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters' },
          { status: 400 }
        );
      }
    }

    console.error('Admin setup error:', error);
    return NextResponse.json({ error: 'Failed to create admin account' }, { status: 500 });
  }
}
