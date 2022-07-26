import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Wallet from '../typeorm/entities/Wallet';
import WalletRepository from '../typeorm/repository/walletRepository';

class ShowWalletService {
  public async execute(id: string): Promise<Wallet | undefined> {
    const walletRepository = getCustomRepository(WalletRepository);
    const wallet = walletRepository.findByCustomerId(id);

    if (!wallet) {
      throw new AppError('Wallet not found');
    }
    return wallet;
  }
}

export default ShowWalletService;
