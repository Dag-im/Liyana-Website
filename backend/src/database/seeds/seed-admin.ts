import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { BCRYPT_ROUNDS } from '../../common/constants/app.constants';
import { UserRole } from '../../common/types/user-role.enum';
import { User } from '../../modules/users/entity/user.entity';

dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    // We use synchronize: true only for the seed script to ensure tables exist
    synchronize: true,
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Data Source has been initialized!');

    const userRepository = dataSource.getRepository(User);

    const adminEmail = 'admin@liyana.com';
    const existingAdmin = await userRepository.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin@123', BCRYPT_ROUNDS);

    const admin = userRepository.create({
      name: 'System Admin',
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await userRepository.save(admin);
    console.log('🚀 Admin user has been seeded successfully.');
    console.log(`📧 Email: ${adminEmail}`);
    console.log('🔑 Password: Admin@123');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    await dataSource.destroy();
  }
}

seed();
