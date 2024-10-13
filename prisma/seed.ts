import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  // cleanup the existing database
  await prisma.user.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const userDavid = await prisma.user.create({
    data: {
      email: 'dneto23@test.com',
      displayName: 'davit',
      password: {
        create: {
          hash: await bcrypt.hash('davidproject', 10),
        },
      },
    },
  });
  const userMike = await prisma.user.create({
    data: {
      email: 'mike7@test.com',
      displayName: 'migueacheal',
      password: {
        create: {
          hash: await bcrypt.hash('mikeproject', 10),
        },
      },
    },
  });
  const userRay = await prisma.user.create({
    data: {
      email: 'ray68@test.com',
      displayName: 'thewal68',
      password: {
        create: {
          hash: await bcrypt.hash('rayproject', 10),
        },
      },
    },
  });
  const userJeff = await prisma.user.create({
    data: {
      email: 'jeff5@test.com',
      displayName: 'guelf',
      password: {
        create: {
          hash: await bcrypt.hash('jeffproject', 10),
        },
      },
    },
  });
  const userEddie = await prisma.user.create({
    data: {
      email: 'eddie8@test.com',
      displayName: 'edwiss',
      password: {
        create: {
          hash: await bcrypt.hash('eddieproject', 10),
        },
      },
    },
  });
  const userDan = await prisma.user.create({
    data: {
      email: 'danscan@test.com',
      displayName: 'dynvel',
      password: {
        create: {
          hash: await bcrypt.hash('danproject', 10),
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
      title: '⚫',
      description: 'The black dot emoji is used to instruct someone to immediately be quiet. It is commonly used as a message reply, or more softly as a message reaction.',
      isActive: true,
      creatorId: userDavid.id,
      authorId: userDavid.id,
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
