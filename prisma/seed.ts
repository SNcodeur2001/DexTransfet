import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create API key for testing
  const apiKey = await prisma.apiKey.upsert({
    where: { key: 'dev-api-key-1234' },
    update: {},
    create: {
      key: 'dev-api-key-1234',
      active: true,
    },
  });

  // Create some sample transfers
  const transfer1 = await prisma.transfer.create({
    data: {
      reference: 'TRF-20241101-ABCD',
      amount: 10000,
      fees: 80,
      total: 10080,
      currency: 'XOF',
      channel: 'WAVE',
      status: 'SUCCESS',
      recipient: {
        phone: '+221770000000',
        name: 'John Doe',
      },
      metadata: {
        orderId: 'ORDER-123',
      },
      providerRef: 'PROV-123456',
    },
  });

  const transfer2 = await prisma.transfer.create({
    data: {
      reference: 'TRF-20241101-EFGH',
      amount: 25000,
      fees: 200,
      total: 25200,
      currency: 'XOF',
      channel: 'ORANGE_MONEY',
      status: 'PENDING',
      recipient: {
        phone: '+221771111111',
        name: 'Jane Smith',
      },
      metadata: {
        orderId: 'ORDER-456',
      },
    },
  });

  console.log('Database seeded successfully');
  console.log('API Key:', apiKey);
  console.log('Sample transfers created:', [transfer1, transfer2]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });