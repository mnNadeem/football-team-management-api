import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdatePlayerDto {
  @ApiProperty({
    description: 'Indicates whether the player is on the transfer list.',
    example: true,
  })
  @IsBoolean()
  isOnTransferList: boolean;

  @ApiPropertyOptional({
    description: 'Price of the player in the transfer market.',
    example: 5000000,
  })
  @IsNumber()
  @IsOptional()
  price: number;
}
