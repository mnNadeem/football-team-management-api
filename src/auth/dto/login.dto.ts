import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Email of the user', example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'P@ssw0rd!' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
