import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { UserFeature } from '../../modules/users/entities/user-feature.entity';
import { FEATURE_KEY } from '../decorators/require-feature.decorator';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeature = this.reflector.getAllAndOverride<string>(FEATURE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredFeature) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    const userFeatureRepo = this.dataSource.getRepository(UserFeature);

    // Check if the user has the required feature
    const userFeature = await userFeatureRepo.findOne({
      where: {
        user: { id: user.id },
        feature: { code: requiredFeature },
      },
      relations: ['feature'],
    });

    if (!userFeature) {
      throw new ForbiddenException(`Access denied. Missing required feature: ${requiredFeature}`);
    }

    return true;
  }
}
