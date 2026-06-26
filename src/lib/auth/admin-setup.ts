import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth/session';

export async function isAdminSetupRequired() {
  const count = await prisma.admin.count();
  return count === 0;
}

export async function createInitialAdmin(input: {
  email: string;
  password: string;
  name: string;
}) {
  const email = input.email.toLowerCase().trim();
  const name = input.name.trim();

  if (!email || !name) {
    throw new Error('INVALID_INPUT');
  }

  if (input.password.length < 8) {
    throw new Error('WEAK_PASSWORD');
  }

  const passwordHash = await hashPassword(input.password);

  return prisma.$transaction(async (tx) => {
    const count = await tx.admin.count();
    if (count > 0) {
      throw new Error('ADMIN_EXISTS');
    }

    return tx.admin.create({
      data: {
        email,
        password: passwordHash,
        name,
        role: 'admin',
      },
    });
  });
}
