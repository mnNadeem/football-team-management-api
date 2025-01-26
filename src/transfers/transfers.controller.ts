import { Controller, Get, Post, Query, Param, Request, UseGuards } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetTransfersDto } from './dto/get-transfers.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';

@ApiTags('transfers')
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transfers' })
  @ApiResponse({ status: 200, description: 'Return all transfers.' })
  async getTransfers(@Query() query: GetTransfersDto) {
    return this.transfersService.getTransfers(query);
  }

  @Post(':playerId/buy')
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buy a player' })
  @ApiResponse({
    status: 201,
    description: 'The player has been successfully bought.',
  })
  async buyPlayer(@Request() req, @Param('playerId') playerId: number) {
    return this.transfersService.buyPlayer(req.user.teamId, playerId);
  }
}
