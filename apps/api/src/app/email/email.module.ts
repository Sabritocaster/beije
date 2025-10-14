import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EMAIL_TRANSPORT } from './email.constants';
import { EmailService } from './email.service';

@Module({
  providers: [
    {
      provide: EMAIL_TRANSPORT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const smtp = config.get('email.smtp');
        if (smtp?.host) {
          return nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port,
            secure: Boolean(smtp.secure),
            auth: smtp.auth,
          });
        }
        return nodemailer.createTransport({
          jsonTransport: true,
        });
      },
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
