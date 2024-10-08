import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  // cleanup the existing database
  await prisma.user.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash('davidproject', 10);

  const userDavid = await prisma.user.create({
    data: {
      email: 'dneto23@test.com',
      displayName: 'dneto23',
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const userMike = await prisma.user.create({
    data: {
      email: 'mike6@test.com',
      displayName: 'migueacheal',
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.loreEntry.create({
    data: {
      title: 'Everyone is here',
      description: 'This joke is deployed when all but one cubby is present.',
      isActive: true,
      examples: [
        'During the Winter 2023 Cubby Summit, Eddie was not in attendance. However, we still kept saying "Every single cubby is here."'
      ],
      creatorId: userDavid.id,
      authorDate: new Date(1702834200 * 1000)
    }
  })

  await prisma.loreEntry.create({
    data: {
      title: 'New York Pancake',
      description: 'A New York Pancake is a flattened rat served on a plate, but the server adds their own twist.',
      isActive: true,
      creatorId: userDavid.id,
      authorId: userMike.id,
      authorDate: new Date(1702747800 * 1000)
    }
  })

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
