import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { Package } from '../packages/entities/package.entity';
import { User } from '../users/entities/user.entity';
import { UserCredit } from '../users/entities/user-credit.entity';
import { UserFeature } from '../users/entities/user-feature.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) { }

  async buyPackage(userId: string, packageId: string): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const packageRepo = queryRunner.manager.getRepository(Package);
      const transactionRepo = queryRunner.manager.getRepository(Transaction);
      const userCreditRepo = queryRunner.manager.getRepository(UserCredit);
      const userFeatureRepo = queryRunner.manager.getRepository(UserFeature);
      const userRepo = queryRunner.manager.getRepository(User);

      // Find user
      const user = await userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      // Find package with features
      const pkg = await packageRepo.findOne({
        where: { id: packageId },
        relations: ['features']
      });

      if (!pkg) {
        throw new NotFoundException('Package not found');
      }

      // 1. Create transaction record
      const transaction = transactionRepo.create({
        amount: pkg.price,
        status: TransactionStatus.SUCCESS, // Simulate success
        user: { id: userId },
        package: { id: packageId },
      });
      await transactionRepo.save(transaction);

      // 2. Update user credits
      const userCredit = await userCreditRepo.findOne({ where: { user: { id: userId } } });
      if (!userCredit) {
        const newCredit = userCreditRepo.create({
          current_credits: Number(pkg.credits),
          user: { id: userId },
        });
        await userCreditRepo.save(newCredit);
      } else {
        await userCreditRepo.update(userCredit.id, {
          current_credits: Number(userCredit.current_credits) + Number(pkg.credits),
        });
      }

      // 3. Add package features to user (if not exists)
      if (pkg.features && pkg.features.length > 0) {
        // Find existing features
        const existingFeatures = await userFeatureRepo.find({
          where: { user: { id: userId } },
          relations: ['feature']
        });
        const existingFeatureIds = existingFeatures.map(uf => uf.feature.id);

        for (const feature of pkg.features) {
          if (!existingFeatureIds.includes(feature.id)) {
            const userFeature = userFeatureRepo.create({
              user: { id: userId },
              feature: { id: feature.id },
            });
            await userFeatureRepo.save(userFeature);
          }
        }
      }

      await queryRunner.commitTransaction();
      return transaction;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByUser(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { user: { id: userId } },
      relations: ['package'],
      order: { created_at: 'DESC' },
    });
  }

  async findOneByUser(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['package'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction #${id} not found`);
    }

    return transaction;
  }
}
