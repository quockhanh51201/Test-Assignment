import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './modules/users/entities/user.entity';
import { UserCredit } from './modules/users/entities/user-credit.entity';
import { UserFeature } from './modules/users/entities/user-feature.entity';
import { Feature } from './modules/features/entities/feature.entity';
import { Package } from './modules/packages/entities/package.entity';
import { Transaction } from './modules/transactions/entities/transaction.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [User, UserCredit, UserFeature, Feature, Package, Transaction],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});
