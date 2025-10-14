import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EmailService } from '../email/email.service';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let emailService: { sendVerificationEmail: jest.Mock };
  let userModel: {
    exists: jest.Mock;
    create: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            exists: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendVerificationEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    emailService = module.get(EmailService) as unknown as {
      sendVerificationEmail: jest.Mock;
    };
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('creates a new user and sends a verification email', async () => {
      userModel.exists.mockResolvedValueOnce(null);
      userModel.exists.mockResolvedValueOnce(null);

      const createdUser = {
        username: 'jane',
        email: 'jane@example.com',
        verificationToken: 'token',
        isVerified: false,
      };

      userModel.create.mockResolvedValue(createdUser);

      const result = await service.register({
        username: 'jane',
        email: 'jane@example.com',
      });

      expect(result).toEqual({
        username: 'jane',
        email: 'jane@example.com',
        isVerified: false,
      });
      expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
        createdUser
      );
    });

    it('throws when username already exists', async () => {
      userModel.exists.mockResolvedValueOnce(true);

      await expect(
        service.register({ username: 'jane', email: 'jane@example.com' })
      ).rejects.toBeInstanceOf(ConflictException);
      expect(emailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it('throws when email already exists', async () => {
      userModel.exists.mockResolvedValueOnce(null);
      userModel.exists.mockResolvedValueOnce(true);

      await expect(
        service.register({ username: 'jane', email: 'jane@example.com' })
      ).rejects.toBeInstanceOf(ConflictException);
      expect(emailService.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    it('throws when user is not found', async () => {
      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.verifyEmail('missing', 'token')
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws when token does not match', async () => {
      const user = {
        username: 'jane',
        email: 'jane@example.com',
        verificationToken: 'different',
        isVerified: false,
      };

      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      await expect(
        service.verifyEmail('jane', 'token')
      ).rejects.toThrow('Verification token is invalid.');
    });

    it('marks user as verified when token matches', async () => {
      const save = jest.fn().mockResolvedValue(undefined);
      const user = {
        username: 'jane',
        email: 'jane@example.com',
        verificationToken: 'token',
        isVerified: false,
        save,
      };

      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await service.verifyEmail('jane', 'token');

      expect(save).toHaveBeenCalled();
      expect(result).toEqual({
        username: 'jane',
        email: 'jane@example.com',
        isVerified: true,
      });
    });
  });

  describe('isVerified', () => {
    it('returns verification status for existing users', async () => {
      const user = {
        username: 'jane',
        email: 'jane@example.com',
        isVerified: true,
      };

      userModel.findOne.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(user),
        }),
      });

      const result = await service.isVerified('jane');
      expect(result).toEqual({
        username: 'jane',
        email: 'jane@example.com',
        isVerified: true,
      });
    });

    it('throws when user is not found', async () => {
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.isVerified('missing')).rejects.toBeInstanceOf(
        NotFoundException
      );
    });
  });
});
