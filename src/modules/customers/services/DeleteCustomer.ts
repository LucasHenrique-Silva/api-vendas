import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';

import { CustomersRepository } from '../typeorm/repositories/customersRepository';

interface IRequest {
  id: string;
}
class DeleteCustomersService {
  public async execute({ id }: IRequest): Promise<void> {
    const customerRepository = getCustomRepository(CustomersRepository);

    const customer = await customerRepository.findById(id);

    if (!customer) {
      throw new AppError('User not found');
    }

    await customerRepository.remove(customer);
  }
}

export default DeleteCustomersService;
