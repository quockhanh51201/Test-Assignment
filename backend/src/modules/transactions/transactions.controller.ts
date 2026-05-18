import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { BuyPackageDto } from './dto/buy-package.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post('buy')
  @ApiOperation({ summary: 'Buy a package using its ID' })
  buyPackage(@CurrentUser() user: any, @Body() buyPackageDto: BuyPackageDto) {
    return this.transactionsService.buyPackage(user.userId, buyPackageDto.package_id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for the authenticated user' })
  findAll(@Req() req: any) {
    return this.transactionsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific transaction' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.transactionsService.findOneByUser(req.user.id, id);
  }
}
