import AppError from '@shared/http/errors/AppError';
import { EntityRepository, Repository } from 'typeorm';
import Wallet from '../entities/Wallet';

@EntityRepository(Wallet)
export default class WalletRepository extends Repository<Wallet> {
  public async findByCustomerId(
    Customer_id: string,
  ): Promise<Wallet | undefined> {
    const wallet = await this.findOne({
      where: {
        customer: Customer_id,
      },
    });
    return wallet;
  }
  public async saldo(id: string): Promise<Wallet> {
    const saldo = await this.findByCustomerId(id);

    if (!saldo) {
      throw new AppError('Wallet not found');
    }

    return saldo;
  }

  public async debitar(id: string, value: number): Promise<Wallet> {
    const saldo = await this.findByCustomerId(id);

    if (!saldo) {
      throw new AppError('Wallet not found');
    }

    saldo.funds = saldo.funds - value;

    return saldo;
  }
}
