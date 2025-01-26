import { Controller, Get, Post, UseGuards, Request } from "@nestjs/common"
import { TeamsService } from "./teams.service"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { AuthenticationGuard } from "src/guards/authentication.guard";

@ApiTags("teams")
@Controller("teams")
@UseGuards(AuthenticationGuard)
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new team for the user' })
  @ApiResponse({ status: 201, description: 'The team has been successfully created.' })
  async createTeam(@Request() req) {
    return this.teamsService.createTeam(req.user);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the user\'s team' })
  @ApiResponse({ status: 200, description: 'Return the user\'s team.' })
  async getTeam(@Request() req) {
    return this.teamsService.getTeamByUserId(req.user.id);
  }
}

