import { LoreEntry } from '@prisma/client';
import { prisma } from "~/db.server";

export function getLoreEntry({ id }: Pick<LoreEntry, 'id'>) {
  return prisma.loreEntry.findFirst({
    where: { id }
  })
}

export function getAllLoreEntries() {
  return prisma.loreEntry.findMany()
}
