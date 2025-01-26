import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockImplementation((dto: CreateUserDto) => Promise.resolve({ id: 1, ...dto })),
            findAll: jest.fn().mockResolvedValue([new User()]),
            findOne: jest.fn().mockResolvedValue(new User()),
            update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Name' }),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = { name: 'John', email: 'john@example.com', password: '1234', roleId: 1 };
    await expect(controller.create(dto)).resolves.toEqual({ id: 1, ...dto });
  });

  it('should return an array of users', async () => {
    await expect(controller.getAllUsers()).resolves.toEqual([new User()]);
  });

  it('should return a single user', async () => {
    await expect(controller.getUserById('1')).resolves.toEqual(new User());
  });

  it('should update a user', async () => {
    const dto: Partial<CreateUserDto> = { name: 'Updated Name' };
    await expect(controller.updateUser('1', dto)).resolves.toEqual({ id: 1, name: 'Updated Name' });
  });

  it('should remove a user', async () => {
    await expect(controller.deleteUser('1')).resolves.toEqual({});
  });
});
