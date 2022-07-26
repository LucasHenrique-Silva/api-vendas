import { CustomersRepository } from '@modules/customers/typeorm/repositories/customersRepository';
import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import ProductRepository from '@modules/products/typeorm/repositories/ProductsRepository';
import { OrdersRepository } from '../typeorm/repositories/OrdersRepository';
import Order from '../typeorm/entities/Order';
import WalletRepository from '@modules/wallet/typeorm/repository/walletRepository';
import UpdateWalletService from '@modules/wallet/services/updatefunds';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductRepository);
    const wallletRepository = getCustomRepository(WalletRepository);

    let total = 0;
    const customerExists = await customersRepository.findById(customer_id);
    const suficiente = await wallletRepository.saldo(customer_id);

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id.');
    }

    const existsProducts = await productsRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError('Could not find any products with the given ids.');
    }

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}.`,
      );
    }

    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity}
        is not available for ${quantityAvailable[0].id}.`,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));
    for (let index = 0; index < serializedProducts.length; index++) {
      const element = serializedProducts[index];
      const pagar = element.price * element.quantity;
      total = total + pagar;
    }
    if (total > suficiente.funds) {
      throw new AppError('Insuficient funds');
    }
    const order = await ordersRepository.createOrder({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updatedProductQuantity = products.map(product => ({
      id: product.id,
      quantity:
        existsProducts.filter(p => p.id === product.id)[0].quantity -
        product.quantity,
    }));

    const updateWallet = await wallletRepository.debitar(customer_id, total);
    await wallletRepository.save(updateWallet);
    console.log(`${updateWallet.funds} lalala`);

    //console.log(updatedProductQuantity);

    await productsRepository.save(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
