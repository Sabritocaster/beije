import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { EMAIL_TRANSPORT } from './email.constants';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(EMAIL_TRANSPORT) private readonly transporter: Transporter,
    private readonly configService: ConfigService
  ) {}

  async sendVerificationEmail(user: Pick<UserDocument, 'username' | 'email' | 'verificationToken'>) {
    const baseUrl = this.configService.get<string>('app.baseUrl');
    const from = this.configService.get<string>('email.from');
    const verificationUrl = new URL(
      `/user/verify-email/${encodeURIComponent(user.username)}/${encodeURIComponent(user.verificationToken)}`,
      baseUrl
    ).toString();

    try {
      const response = await this.transporter.sendMail({
        to: user.email,
        from,
        subject: 'Verify your email address',
        text: [
          `Hi ${user.username},`,
          '',
          'Please verify your email address by visiting the link below:',
          verificationUrl,
          '',
          'If you did not request this, you can safely ignore the message.',
        ].join('\n'),
        html: [
          `<p>Hi ${user.username},</p>`,
          '<p>Please verify your email address by clicking the link below:</p>',
          `<p><a href="${verificationUrl}">Verify email address</a></p>`,
          '<p>If you did not request this, you can safely ignore the message.</p>',
        ].join('\n'),
      });

      if ((response as { messageId?: string }).messageId) {
        this.logger.debug(
          `Verification email queued for ${user.email} (messageId=${response.messageId}).`
        );
      } else {
        this.logger.debug(`Verification email processed for ${user.email}.`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${user.email}: ${error instanceof Error ? error.message : error}`
      );
      throw new InternalServerErrorException(
        'Unable to send verification email. Please try again later.'
      );
    }
  }
}
