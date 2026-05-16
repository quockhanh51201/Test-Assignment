import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeatureDto {
  @ApiProperty({ example: 'generate_image' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'AI Image Generation' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Allows user to generate AI images', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
