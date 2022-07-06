import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';

import { CustomersRepository } from '../typeorm/repositories/customersRepository';

interface IRequest {
  user_id: string;
}
class DeleteCustomersService {
  public async execute({ user_id }: IRequest): Promise<void> {
    const customerRepository = getCustomRepository(CustomersRepository);

    const customer = await customerRepository.findById(user_id);

    if (!customer) {
      throw new AppError('User not found');
    }

    await customerRepository.remove(customer);
  }
}

export default DeleteCustomersService;
