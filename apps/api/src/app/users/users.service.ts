import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { EmailService } from '../email/email.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User, UserDocument } from './schemas/user.schema';

export interface UserResponse {
  username: string;
  email: string;
  isVerified: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService
  ) {}

  async register(dto: RegisterUserDto): Promise<UserResponse> {
    const [usernameExists, emailExists] = await Promise.all([
      this.userModel.exists({ username: dto.username }),
      this.userModel.exists({ email: dto.email }),
    ]);

    if (usernameExists) {
      throw new ConflictException('Username is already taken.');
    }

    if (emailExists) {
      throw new ConflictException('Email is already registered.');
    }

    const verificationToken = randomBytes(32).toString('hex');

    const user = await this.userModel.create({
      username: dto.username,
      email: dto.email,
      verificationToken,
      isVerified: false,
    });
    await this.emailService.sendVerificationEmail(user);

    return this.toResponse(user);
  }

  async verifyEmail(username: string, token: string): Promise<UserResponse> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.verificationToken !== token) {
      throw new BadRequestException('Verification token is invalid.');
    }

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    return this.toResponse(user);
  }

  async isVerified(username: string): Promise<UserResponse> {
    const user = await this.userModel
      .findOne({ username })
      .select(['username', 'email', 'isVerified'])
      .exec();

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.toResponse(user);
  }

  private toResponse(user: UserDocument): UserResponse {
    return {
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
    };
  }
}
