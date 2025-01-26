import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetTransfersDto {
  @ApiPropertyOptional({
    description: 'Filter transfers by team name.',
    example: 'Manchester United',
  })
  @IsString()
  @IsOptional()
  teamName?: string;

  @ApiPropertyOptional({
    description: 'Filter transfers by player name.',
    example: 'Cristiano Ronaldo',
  })
  @IsString()
  @IsOptional()
  playerName?: string;

  @ApiPropertyOptional({
    description: 'Filter transfers by maximum price.',
    example: 50000000,
  })
  @IsOptional()
  maxPrice?: number;
}
