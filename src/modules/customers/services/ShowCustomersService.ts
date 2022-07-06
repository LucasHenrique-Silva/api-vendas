import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import { CustomersRepository } from '../typeorm/repositories/customersRepository';

interface IRequest {
  user_id: string;
}
class ShowCustomersService {
  public async execute({ user_id }: IRequest): Promise<Customer> {
    const customerRepository = getCustomRepository(CustomersRepository);

    const customer = await customerRepository.findById(user_id);

    if (!customer) {
      throw new AppError('User not found');
    }

    return customer;
  }
}

export default ShowCustomersService;
