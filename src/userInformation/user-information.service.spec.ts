import { Test, TestingModule } from '@nestjs/testing';
import { UserInformationService } from './userinformation.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import {
  CreateUserInformationDto,
  Status,
} from './dto/create.userInformation.dto';

describe('UserInformationService', () => {
  let service: UserInformationService;

  const prismaMock = {
    usersInformation: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    users: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserInformationService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UserInformationService>(UserInformationService);

    jest.clearAllMocks();
  });

  /* ================= getAll ================= */

  it('should return paginated user informations', async () => {
    prismaMock.usersInformation.findMany.mockResolvedValue([
      { id: '1', firstName: 'John' },
    ]);

    prismaMock.usersInformation.count.mockResolvedValue(1);

    const result = await service.getAll({ page: 1, limit: 10 });

    expect(result.success).toBe(true);
    expect(result.data.length).toBe(1);

    expect(prismaMock.usersInformation.findMany).toHaveBeenCalled();
    expect(prismaMock.usersInformation.count).toHaveBeenCalled();
  });

  /* ================= findOne ================= */

  it('should return user information by user id', async () => {
    prismaMock.users.findUnique.mockResolvedValue({
      id: 'user1',
      usersInformationId: 'info1',
    });

    prismaMock.usersInformation.findUnique.mockResolvedValue({
      id: 'info1',
      firstName: 'John',
    });

    const result = await service.findOne('user1');

    expect(result.success).toBe(true);
    expect(result.data?.firstName).toBe('John');
  });

  it('should throw NotFoundException if user not found', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  /* ================= createUserInformationAndLinkToUser ================= */

  it('should create userInformation and link to user in transaction', async () => {
    const dto: CreateUserInformationDto = {
      firstName: 'John',
      lastName: 'Doe',
      citizenId: '123456',
      id_card_image: 'img.png',
      phone: '0999999999',
      dateOfBirth: new Date(),
      status: Status.PENDING,
      userId: 'user1',
    };

    const createdInfo = { id: 'info1', ...dto };

    const createMock = jest.fn().mockResolvedValue(createdInfo);
    const updateMock = jest.fn().mockResolvedValue({});

    prismaMock.$transaction.mockImplementation((cb) => {
      return Promise.resolve(
        cb({
          usersInformation: { create: createMock },
          users: { update: updateMock },
        }),
      );
    });

    const result = await service.createUserInformationAndLinkToUser(
      dto,
      'user1',
    );

    expect(result.id).toBe('info1');
  });

  /* ================= updateUserInformation ================= */

  it('should update user information with relations', async () => {
    prismaMock.usersInformation.update.mockResolvedValue({
      id: 'info1',
      firstName: 'Updated',
    });

    const payload: any = {
      firstName: 'Updated',
      provinceCode: 10,
    };

    const result = await service.updateUserInformation('info1', payload);

    expect(result.success).toBe(true);
    expect(result.result.firstName).toBe('Updated');

    expect(prismaMock.usersInformation.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'info1' },
      }),
    );
  });

  it('should throw BadRequestException on prisma error', async () => {
    prismaMock.usersInformation.update.mockRejectedValue(
      new Error('Update failed'),
    );

    await expect(
      service.updateUserInformation('info1', { firstName: 'x' } as any),
    ).rejects.toThrow(BadRequestException);
  });
});
