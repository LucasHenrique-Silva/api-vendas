import { log } from 'console';
import { string } from 'joi';
import nodemailer from 'nodemailer';

interface ISendMail {
  to: string;
  body: string;
}

export default class EtherealMail {
  static async sendMail({ to, body }: ISendMail): Promise<void> {
    const acount = await nodemailer.createTestAccount();

    const transport = nodemailer.createTransport({
      host: acount.smtp.host,
      port: acount.smtp.port,
      secure: acount.smtp.secure,
      auth: {
        user: acount.user,
        pass: acount.pass,
      },
    });
    const message = await transport.sendMail({
      from: 'equipev@apivendas.com.br',
      to,
      subject: 'Password Reset',
      text: body,
    });

    console.log('message sent: %s', message.messageId);
    console.log('Preview ulr: %s', nodemailer.getTestMessageUrl(message));
  }
}
