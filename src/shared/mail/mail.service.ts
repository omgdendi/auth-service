import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: Mail;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_FROM'),
        to,
        subject,
        text,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }
}
