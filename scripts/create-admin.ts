import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Create PostgreSQL pool
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const username = 'admin';
  const password = 'admin123';

  console.log('Creating admin user...');

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    console.log('Admin user already exists!');
    console.log('Username:', username);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin
  await prisma.admin.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  console.log('Admin user created successfully!');
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('\n⚠️  IMPORTANT: Change these credentials in production!');
}

main()
  .catch((e) => {
    console.error('Error creating admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
