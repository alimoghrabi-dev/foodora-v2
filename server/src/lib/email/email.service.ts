import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT') || 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, htmlContent: string) {
    const mailOptions = {
      from: `"Foodora V2" <${this.configService.get<string>('EMAIL_USER')}>`,
      to,
      subject,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);

      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        console.error(error.message);
        throw new BadRequestException(error.message);
      } else {
        console.error(error);
        throw new BadRequestException('Failed to send email');
      }
    }
  }
}
