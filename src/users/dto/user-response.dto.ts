import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'Unique identifier of the user', example: 1 })
  id: number;

  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'Email of the user', example: 'johndoe@example.com' })
  email: string;
}