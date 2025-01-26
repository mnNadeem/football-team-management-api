import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  async savePlayer(player: Player): Promise<Player> {
    try {
      return await this.playersRepository.save(player);
    } catch (error) {
      throw error;
    }
  }

  async findAllByTeamId(teamId: number): Promise<Player[]> {
    return this.playersRepository.find({ where: { team: { id: teamId } } });
  }

  async findOne(id: number): Promise<Player> {
    try {
      const player = await this.playersRepository.findOne({
        where: { id },
        relations: ['team'],
      });

      return player;
    } catch (error) {
      throw error;
    }
  }

  async getPlayersByTeamId(teamId: number): Promise<Player[]> {
    return this.playersRepository.find({ where: { team: { id: teamId } } });
  }

  async updatePlayerTransferStatus(
    playerId: number,
    isOnTransferList: boolean,
    price: number,
  ): Promise<Player> {
    const player = await this.playersRepository.findOne({
      where: { id: playerId },
    });
    player.isOnTransferList = isOnTransferList;
    player.price = price;
    return this.playersRepository.save(player);
  }
}
