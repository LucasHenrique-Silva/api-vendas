import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { isAfter, addHours } from 'date-fns';
import { UsersRepository } from '../typeorm/repositories/UserRepository';
import { UsersTokensRepository } from '../typeorm/repositories/UserTokensRepository';
import { hash } from 'bcryptjs';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const usersTokenRepository = getCustomRepository(UsersTokensRepository);

    const userToken = await usersTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError("User Token doesn't exists");
    }

    const user = await usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError("User doesn't exists");
    }

    const tokenCreatedat = userToken.created_at;
    const compareDate = addHours(tokenCreatedat, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    user.password = await hash(password, 10);

    await usersRepository.save(user);
  }
}

export default ResetPasswordService;
