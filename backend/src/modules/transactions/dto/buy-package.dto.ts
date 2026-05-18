import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuyPackageDto {
  @ApiProperty({ example: '8a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a' })
  @IsUUID()
  @IsNotEmpty()
  package_id: string;
}