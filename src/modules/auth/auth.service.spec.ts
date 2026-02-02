import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';

describe('AuthService - register', () => {
  let service: AuthService;

  const prismaMock = {
    users: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  const jwtMock = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: JwtService,
          useValue: jwtMock, // ✅ mock jwt
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.spyOn(service, 'createUserRole').mockResolvedValue({} as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register new user successfully', async () => {
    prismaMock.users.findFirst.mockResolvedValue(null);

    prismaMock.users.create.mockResolvedValue({
      id: '123',
      email: 'test@test.com',
      name: 'Test',
    });

    const result = await service.register({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    expect(result.success).toBe(true);
    expect(result.data.email).toBe('test@test.com');
  });

  it('should throw ConflictException if email exists', async () => {
    prismaMock.users.findFirst.mockResolvedValue({ id: '1' });

    await expect(
      service.register({
        name: 'Test',
        email: 'test@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('should throw error if createUserRole fails', async () => {
    prismaMock.users.findFirst.mockResolvedValue(null);

    prismaMock.users.create.mockResolvedValue({
      id: '123',
      email: 'test@test.com',
    });

    (service.createUserRole as jest.Mock).mockRejectedValue(
      new Error('USER role not found'),
    );

    await expect(
      service.register({
        name: 'Test',
        email: 'test@test.com',
        password: '123456',
      }),
    ).rejects.toThrow();
  });
});
