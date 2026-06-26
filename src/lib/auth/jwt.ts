import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'factify-admin-session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

function getSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is required');
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(admin: AdminSession) {
  return new SignJWT({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.id !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.name !== 'string' ||
      typeof payload.role !== 'string'
    ) {
      return null;
    }
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
