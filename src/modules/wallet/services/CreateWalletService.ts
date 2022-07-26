import { CustomersRepository } from '@modules/customers/typeorm/repositories/customersRepository';
import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Wallet from '../typeorm/entities/Wallet';
import WalletRepository from '../typeorm/repository/walletRepository';

class CreateWalletService {
  public async execute(customer: string): Promise<Wallet> {
    const walletRepository = getCustomRepository(WalletRepository);
    const customerRepository = getCustomRepository(CustomersRepository);
    const WalletExists = await walletRepository.findByCustomerId(customer);
    const costumerExists = await customerRepository.findById(customer);

    if (!costumerExists) {
      throw new AppError('Client not found');
    }

    if (WalletExists) {
      throw new AppError('Wallet already Created');
    }

    const wallet = walletRepository.create({
      funds: 0,
      customer: costumerExists,
    });
    await walletRepository.save(wallet);
    return wallet;
  }
}

export default CreateWalletService;
