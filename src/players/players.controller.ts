import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { GetTransfersDto } from 'src/transfers/dto/get-transfers.dto';

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all players for the user's team" })
  @ApiResponse({
    status: 200,
    description: "Return all players for the user's team.",
  })
  async getPlayers(@Request() req) {
    return await this.playersService.getPlayersByTeamId(req.user.teamId);
  }

  @Put(':id/transfer-status')
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update player transfer status' })
  @ApiResponse({
    status: 200,
    description: 'The player transfer status has been updated.',
  })
  async updatePlayerTransferStatus(
    @Param('id') id: number,
    @Body() updateData: UpdatePlayerDto,
  ) {
    return this.playersService.updatePlayerTransferStatus(
      id,
      updateData.isOnTransferList,
      updateData.price,
    );
  }

  @Get("available-for-transfer")
  @ApiOperation({ summary: 'Get all transfers' })
  @ApiResponse({ status: 200, description: 'Return all transfers.' })
  async getTransfers(@Query() query: GetTransfersDto) {
    return this.playersService.getTransfers(query);
  }
}
