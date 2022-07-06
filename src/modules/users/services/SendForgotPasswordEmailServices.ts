import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../typeorm/repositories/UserRepository';
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

    //console.log(token);
    Etherealmail.sendMail({
      to: email,
      body: `Solictaçao de redefinição de senha recebida: ${token?.id}`,
    });
  }
}

export default SendForgotPasswordEmailServices;
