import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should call AuthService login method with correct parameters', async () => {
    const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
    const result = { access_token: 'test_token' };

    jest.spyOn(authService, 'login').mockResolvedValue(result);

    expect(await authController.login(loginDto)).toBe(result);
    expect(authService.login).toHaveBeenCalledWith(loginDto);
  });
});
