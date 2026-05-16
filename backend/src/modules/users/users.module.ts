import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserCredit } from './entities/user-credit.entity';
import { UserFeature } from './entities/user-feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserCredit, UserFeature])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
