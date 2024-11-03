import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getAllUsers() {
  return prisma.user.findMany()
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

/**
 * Gets a user an related `LoreEntries`. For use on the Profile page.
 */
export async function getUserWithLoreEntries(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      authorOf: {
        take: 5,
        orderBy: {
          createdAt: 'desc'
        }
      },
      createdEntries: {
        take: 5,
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(
  { email, displayName }: Pick<User, 'email' | 'displayName'>,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      displayName,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
