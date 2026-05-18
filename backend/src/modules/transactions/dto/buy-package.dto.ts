import { IsUUID, IsNotEmpty } from 'class-validator';

export class BuyPackageDto {
  @IsUUID()
  @IsNotEmpty()
  package_id: string;
}
