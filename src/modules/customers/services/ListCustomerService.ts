import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import { CustomersRepository } from '../typeorm/repositories/customersRepository';

class ListUserService {
  public async execute(): Promise<Customer[]> {
    const costumerRepository = getCustomRepository(CustomersRepository);

    const customer = costumerRepository.find();

    return customer;
  }
}

export default ListUserService;
