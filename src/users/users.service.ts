import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { IResponseMessage } from 'src/interfaces/response-message.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });

      if (existingUser) {
        throw new HttpException(
          `User with email: ${createUserDto.email} already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const userToCreateData = {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      };

      const user = this.userRepository.create(userToCreateData);
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: { id: true, name: true, email: true },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: { id: true, name: true, email: true },
    });
  }

  async validateUser(email: string, password: string) {
    const user = this.userRepository.findOneBy({ email, password });
    if (user) {
      return { ...user, password: undefined };
    }
    return undefined;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      await this.findOne(id);
      const updatedRole = await this.userRepository.update(id, updateUserDto);

      if (!updatedRole.affected) {
        throw new HttpException(
          'Could not update the user',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<IResponseMessage> {
    try {
      await this.findOne(id);
      const deletedUser = await this.userRepository.delete(id);

      if (!deletedUser.affected) {
        throw new HttpException('User not deleted', HttpStatus.NOT_FOUND);
      }

      return { message: 'User deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
