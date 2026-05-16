import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePackageDto {
  @ApiProperty({ example: 'Gói VIP' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Full tính năng', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  credits: number;

  @ApiProperty({ type: [String], description: 'Array of feature UUIDs', required: false })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  featureIds?: string[];
}
