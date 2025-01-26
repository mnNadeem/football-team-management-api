import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Request,
  UseGuards,
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

@ApiTags('players')
@Controller('players')
// @UseGuards(AuthenticationGuard)
// @ApiBearerAuth()
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOperation({ summary: "Get all players for the user's team" })
  @ApiResponse({
    status: 200,
    description: "Return all players for the user's team.",
  })
  async getPlayers(@Request() req) {
    return this.playersService.getPlayersByTeamId(req.user.teamId);
  }

  @Put(':id/transfer-status')
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
}
