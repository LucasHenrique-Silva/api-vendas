import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import RedisCache from '@shared/cache/rediscache';
import ProductRepository from '../typeorm/repositories/ProductsRepository';

class ListProductSevice {
  public async execute(): Promise<Product[]> {
    const productsRepository = getCustomRepository(ProductRepository);

    const redisCache = new RedisCache();

    let products = await redisCache.recover<Product[]>('api-vendas-list');

    if (!products) {
      products = await productsRepository.find();

      await redisCache.save('api-vendas-list', products);
    }

    await redisCache.save('teste', 'teste');

    return products;
  }
}

export default ListProductSevice;
