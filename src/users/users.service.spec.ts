import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: '1234',
        roleId: 1,
      };
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repo, 'create').mockReturnValue({ id: 1, ...dto });
      jest.spyOn(repo, 'save').mockResolvedValue({ id: 1, ...dto });
      expect(await service.create(dto)).toEqual({ id: 1, ...dto });
    });

    it('should throw an error if the user already exists', async () => {
      const dto: CreateUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: '1234',
        roleId: 1,
      };
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(new User());
      await expect(service.create(dto)).rejects.toThrow(
        new HttpException(
          `User with email: ${dto.email} already exists`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('findOne', () => {
    it('should find one user', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(new User());
      expect(await service.findOne(1)).toEqual(new User());
    });

    it('should throw an error if the user is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {
      const user = new User();
      jest.spyOn(repo, 'findOne').mockResolvedValue(user);
      expect(await service.findOneByEmail('test@example.com')).toEqual(user);
    });

    it('should return null if no user is found by email', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      expect(await service.findOneByEmail('test@example.com')).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [new User()];
      jest.spyOn(repo, 'find').mockResolvedValue(users);
      expect(await service.findAll()).toEqual(users);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: Partial<CreateUserDto> = { name: 'Updated Name' };
      jest.spyOn(repo, 'findOne').mockResolvedValue(new User());
      jest
        .spyOn(repo, 'update')
        .mockResolvedValue({ generatedMaps: [], affected: 1, raw: [] });
      jest.spyOn(repo, 'findOne').mockResolvedValue({
        id: 1,
        name: 'Updated Name',
        email: 'test@gmail.com',
        password: 'Abc123@!',
        roleId: 1,
      });
      expect(await service.update(1, dto)).toEqual({
        id: 1,
        name: 'Updated Name',
        email: 'test@gmail.com',
        password: 'Abc123@!',
        roleId: 1,
      });
    });

    it('should throw an error if the user is not found for updating', async () => {
      const dto: Partial<CreateUserDto> = { name: 'Updated Name' };
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(1, dto)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(new User());
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1, raw: [] });
      expect(await service.remove(1)).toEqual({
        message: 'User deleted successfully',
      });
    });

    it('should throw an error if the user is not found for deletion', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
