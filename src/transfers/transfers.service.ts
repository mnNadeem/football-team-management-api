import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from './entities/transfer.entity';
import { PlayersService } from 'src/players/players.service';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(Transfer)
    private transfersRepository: Repository<Transfer>,
    private playersService: PlayersService,
    private teamsService: TeamsService,
  ) {}

  async getTransfers(filters: {
    teamName?: string;
    playerName?: string;
    maxPrice?: number;
  }): Promise<Transfer[]> {
    try {
      const query = this.transfersRepository
        .createQueryBuilder('transfer')
        .leftJoinAndSelect('transfer.player', 'player')
        .leftJoinAndSelect('transfer.sellingTeam', 'sellingTeam')
        .where('player.isOnTransferList = :isOnTransferList', {
          isOnTransferList: true,
        });

      if (filters.teamName) {
        query.andWhere('sellingTeam.name LIKE :teamName', {
          teamName: `%${filters.teamName}%`,
        });
      }

      if (filters.playerName) {
        query.andWhere('player.name LIKE :playerName', {
          playerName: `%${filters.playerName}%`,
        });
      }

      if (filters.maxPrice) {
        query.andWhere('player.price <= :maxPrice', {
          maxPrice: filters.maxPrice,
        });
      }

      return query.getRawMany();
    } catch (error) {
      throw error;
    }
  }

  async buyPlayer(buyingTeamId: number, playerId: number): Promise<Transfer> {
    try {
      const player = await this.playersService.findOne(playerId);
      const buyingTeam = await this.teamsService.findOne(buyingTeamId);
      const sellingTeam = player.team;

      if (!player.isOnTransferList) {
        throw new BadRequestException('Player is not on the transfer list');
      }

      const transferPrice = player.price * 0.95;

      if (buyingTeam.budget < transferPrice) {
        throw new BadRequestException('Insufficient funds');
      }

      const buyingTeamPlayerCount = (
        await this.playersService.findAllByTeamId(buyingTeamId)
      ).length;
      if (buyingTeamPlayerCount >= 25) {
        throw new BadRequestException(
          'Buying team has reached the maximum number of players',
        );
      }

      const sellingTeamPlayerCount = (
        await this.playersService.findAllByTeamId(sellingTeam.id)
      ).length;
      if (sellingTeamPlayerCount <= 15) {
        throw new BadRequestException('Selling team cannot have fewer than 15 players');
      }

      player.team = buyingTeam;
      player.isOnTransferList = false;
      await this.playersService.savePlayer(player);

      buyingTeam.budget -= transferPrice;
      sellingTeam.budget += transferPrice;
      await this.teamsService.saveTeam([buyingTeam, sellingTeam]);

      const transfer = new Transfer();
      transfer.player = player;
      transfer.sellingTeam = sellingTeam;
      transfer.buyingTeam = buyingTeam;
      transfer.price = transferPrice;

      return this.transfersRepository.save(transfer);
    } catch (error) {
      throw error;
    }
  }
}
