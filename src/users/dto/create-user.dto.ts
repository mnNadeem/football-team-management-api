import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'P@ssword1!' })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ description: 'Role id of the user', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;
}
