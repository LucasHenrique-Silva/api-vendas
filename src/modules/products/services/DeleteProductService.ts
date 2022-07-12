import RedisCache from '@shared/cache/rediscache';
import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import ProductRepository from '../typeorm/repositories/ProductsRepository';

interface IRequest {
  id: string;
}

class DeleteProductSevice {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found');
    }
    const redisCache = new RedisCache();
    await redisCache.invalidate('api-vendas-list');
    await productsRepository.remove(product);
  }
}

export default DeleteProductSevice;
