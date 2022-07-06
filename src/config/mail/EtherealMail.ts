import { log } from 'console';
import { string } from 'joi';
import nodemailer from 'nodemailer';
import HandlebarsMailTemplate from './HandlebarsEmailconfig';

interface IMailContact {
  name: string;
  email: string;
}

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  file: string;
  variables: ITemplateVariable;
}

interface ISendMail {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplate;
}

export default class EtherealMail {
  static async sendMail({
    from,
    to,
    subject,
    templateData,
  }: ISendMail): Promise<void> {
    const acount = await nodemailer.createTestAccount();

    const mailTemplate = new HandlebarsMailTemplate();

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
      from: {
        name: from?.name || 'Equipe API Vendas',
        address: from?.email || 'equipe@apivendas.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await mailTemplate.parse(templateData),
    });

    console.log('message sent: %s', message.messageId);
    console.log('Preview ulr: %s', nodemailer.getTestMessageUrl(message));
  }
}
