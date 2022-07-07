import AppError from '@shared/http/errors/AppError';
import { OrdersRepository } from '../typeorm/repositories/OrdersRepository';
import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';

interface IRequest {
  id: string;
}

class ShowOrderService {
  public async execute({ id }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);

    const order = await ordersRepository.findById(id);

    if (!order) {
      throw new AppError('Could not find any order with the given id.');
    }

    return order;
  }
}

export default ShowOrderService;
