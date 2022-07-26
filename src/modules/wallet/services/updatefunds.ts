import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Wallet from '../typeorm/entities/Wallet';
import WalletRepository from '../typeorm/repository/walletRepository';

interface IRequest {
  id: string;
  funds: any;
}
class UpdateWalletService {
  public async execute({ id, funds }: IRequest): Promise<Wallet> {
    const walletRepository = getCustomRepository(WalletRepository);

    const wallet = await walletRepository.findByCustomerId(id);

    if (!wallet) {
      throw new AppError('wallet not found');
    }
    wallet.funds = parseFloat(wallet.funds) + parseFloat(funds);
    console.log(wallet.funds);

    await walletRepository.save(wallet);

    return wallet;
  }
}

export default UpdateWalletService;
