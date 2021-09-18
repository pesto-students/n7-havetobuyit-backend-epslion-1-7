import { Inject, Injectable } from '@nestjs/common';
import { SendOptions } from '../../interfaces/mail.interface';
import { Mandrill } from 'mandrill-api';
import { TRANSPORTER } from './constants';

@Injectable()
export class MailService {
  constructor(@Inject(TRANSPORTER) private readonly transporter: Mandrill) {}

  sendMail(mailOptions: SendOptions) {
    return this.transporter.messages.send({
      message: mailOptions,
    });
  }
}
