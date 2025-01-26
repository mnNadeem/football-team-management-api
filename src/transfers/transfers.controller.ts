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
