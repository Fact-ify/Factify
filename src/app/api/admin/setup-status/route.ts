import { NextResponse } from 'next/server';
import { isAdminSetupRequired } from '@/lib/auth/admin-setup';

export async function GET() {
  try {
    const setupRequired = await isAdminSetupRequired();
    return NextResponse.json({ setupRequired });
  } catch (error) {
    console.error('Setup status error:', error);
    return NextResponse.json({ error: 'Failed to check setup status' }, { status: 500 });
  }
}
