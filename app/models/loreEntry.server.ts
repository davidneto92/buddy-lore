import { LoreEntry, User } from '@prisma/client';
import { prisma } from "~/db.server";

export function getLoreEntry({ id }: Pick<LoreEntry, 'id'>) {
  return prisma.loreEntry.findFirst({
    where: { id },
    include: {
      author: true,
      creator: true
    }
  })
}

export function getAllLoreEntries() {
  return prisma.loreEntry.findMany()
}

interface ICreateLoadEntryPayload extends Pick<LoreEntry,
  'title' | 'description' | 'isActive' | 'creatorId' | 'authorId' | 'authorDate'
> { }

export function createLoreEntry({
  title, description, isActive, creatorId, authorId
}: ICreateLoadEntryPayload) {
  return prisma.loreEntry.create({
    data: {
      title,
      description,
      isActive,
      creatorId,
      authorId,
    }
  })
}
