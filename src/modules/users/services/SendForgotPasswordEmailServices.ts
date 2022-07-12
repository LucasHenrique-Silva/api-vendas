import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../typeorm/repositories/UserRepository';
import path from 'path';
import { UsersTokensRepository } from '../typeorm/repositories/UserTokensRepository';
import Etherealmail from '@config/mail/EtherealMail';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailServices {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const usersTokenRepository = getCustomRepository(UsersTokensRepository);

    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User doesn't exists");
    }

    const token = await usersTokenRepository.generate(user.id);

    const forgotPassTem = path.resolve(
      __dirname,
      '..',
      'views',
      'forgotPassword.hbs',
    );
    console.log(token.token);

    Etherealmail.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'Api vendas',
      templateData: {
        file: forgotPassTem,
        variables: {
          name: user.name,
          link: `${process.env.APP_API_URL}/reset_password?token=${token.token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailServices;
