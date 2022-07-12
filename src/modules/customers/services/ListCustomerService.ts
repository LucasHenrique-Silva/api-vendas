import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import { CustomersRepository } from '../typeorm/repositories/customersRepository';

interface IPaginateCustomer {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  data: Customer[];
}

class ListCustomersService {
  public async execute(): Promise<IPaginateCustomer> {
    const costumerRepository = getCustomRepository(CustomersRepository);

    const customers = await costumerRepository
      .createQueryBuilder('customer')
      .paginate();

    return customers as IPaginateCustomer;
  }
}

export default ListCustomersService;
