import { generateAccessCode, hashString, verifyHash } from '../security/encryption';
import prisma from '../db/prisma';

export async function createUserWithAccessCode(username: string, email?: string) {
  const accessCode = generateAccessCode();
  const accessCodeHash = await hashString(accessCode);

  const user = await prisma.user.create({
    data: {
      username: username.toLowerCase(),
      email: email?.toLowerCase(),
      accessCodeHash,
    },
  });

  return {
    user,
    accessCode, // Return the plain access code (only time it's visible)
  };
}

export async function verifyAccessCode(accessCode: string): Promise<string | null> {
  // Get all users (we need to check hash for each)
  // In production, you might want to add a lookup table for performance
  const users = await prisma.user.findMany({
    select: {
      id: true,
      accessCodeHash: true,
    },
  });

  for (const user of users) {
    const isValid = await verifyHash(accessCode, user.accessCodeHash);
    if (isValid) {
      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
      return user.id;
    }
  }

  return null;
}

export async function getUserByAccessCode(accessCode: string) {
  const userId = await verifyAccessCode(accessCode);

  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
  });
}
