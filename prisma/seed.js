const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const main = async () => {
  await prisma.$transaction(
    Object.keys(prisma).map((model) => {
      if (model[0] === '_' || model.includes('$')) {
        return prisma.user.findUnique({ where: { id: 0 } });
      }
      return prisma[model].deleteMany();
    }),
  );
  console.log('Deleted all data');

  await prisma.user.createMany({
    data: [
      'Natalie Borowska',
      'Enoch Choi',
      'Anne Codd',
      'Abigail Dayton',
      'Vaanya Dhir',
      'Amelia Guo',
      'Luke Hatzis',
      'Gwendolyn Leonard',
      'Jiya Malhotra',
      'Ella Mui',
      "Kibali O'Donald",
      'Sophia Pucci',
      'Emily Robertson',
      'Anika Shukla',
      'Elaina Treacy',
      'Hannah Wong',
      'Audrey Zelezniak Berezowski',
      'Mr. Boken',
    ].map((name, i) => ({ name, id: i + 1 })),
  });

  await prisma.table.createMany({
    data: new Array(12).fill(0).map((_, i) => ({ id: i + 1, disabled: false })),
  });
};

main();
