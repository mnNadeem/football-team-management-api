import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ERole } from 'src/enums/role.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a token for valid user credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        id: 1,
        name: 'Test User',
        email: loginDto.email,
        password: 'hashed_password',
        roleId: 1,
        role: { id: 1, roleName: ERole.USER },
      };
      const accessToken = 'test_token';

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);

      expect(await authService.login(loginDto)).toEqual({
        access_token: accessToken,
      });
    });

    it('should throw an error if user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'notfound@example.com',
        password: 'password',
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(HttpException);
    });

    it('should throw an error if the password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };
      const user = {
        id: 1,
        name: 'Test User',
        email: loginDto.email,
        password: 'hashed_password',
        roleId: 1,
        role: { id: 1, roleName: ERole.USER },
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(HttpException);
    });
  });
});
