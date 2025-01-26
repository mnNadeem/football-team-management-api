import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { Player } from 'src/players/entities/player.entity';
import { User } from 'src/users/entities/user.entity';
import { PlayersService } from 'src/players/players.service';
import {
  AVAILABLE_POSITIONS,
  MAX_TEAM_BUDGET,
  PLAYER_MAX_PRICE,
} from 'src/constants';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,
    private readonly playersService: PlayersService,
  ) {}

  async saveTeam(team: Team | Team[]): Promise<Team | Team[]> {
    try {
      if (Array.isArray(team)) {
        return await this.teamsRepository.save(team);
      } else {
        return await this.teamsRepository.save(team);
      }
    } catch (error) {
      throw error;
    }
  }

  async createTeam(user: User): Promise<Team> {
    try {
      const team = new Team();
      team.name = `${user.name}'s Team`;
      team.budget = MAX_TEAM_BUDGET;
      team.user = user;

      const savedTeam = await this.teamsRepository.save(team);

      for (const position of AVAILABLE_POSITIONS) {
        for (let i = 0; i < position.count; i++) {
          const player = new Player();
          player.name = `${position.name} ${i + 1}`;
          player.position = position.name;
          player.price =
            Math.floor(Math.random() * PLAYER_MAX_PRICE) + MAX_TEAM_BUDGET;
          player.team = savedTeam;
          await this.playersService.savePlayer(player);
        }
      }

      return savedTeam;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Team> {
    try {
      const Team = await this.teamsRepository.findOne({
        where: { id },
      });

      return Team;
    } catch (error) {
      throw error;
    }
  }

  async getTeamByUserId(userId: number): Promise<Team> {
    return this.teamsRepository.findOne({
      where: { user: { id: userId } },
      relations: { players: true },
    });
  }
}
