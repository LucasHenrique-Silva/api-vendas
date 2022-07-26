import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import OrderController from '../controllers/OrdersController';
import { PrismaClient } from '@prisma/client';
import AppError from '@shared/http/errors/AppError';

const orderRouter = Router();
const ordersController = new OrderController();
const prisma = new PrismaClient();

orderRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ordersController.show,
);
orderRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().uuid().required(),
      products: Joi.required(),
    },
  }),
  ordersController.create,
);

orderRouter.post('/create', async (req, res) => {
  const customer = await prisma.costumers.findFirst({
    orderBy: {
      created_at: 'desc',
    },
    where: {
      orders: {
        none: {},
      },
    },
  });
  const prod = await prisma.products.findFirst({
    orderBy: {
      created_at: 'desc',
    },
    where: {
      quantity: {
        gt: 6,
      },
    },
  });
  if (!prod) {
    throw new AppError('Not found product');
  }
  const wallet = await prisma.wallet.findFirst({
    where: {
      Customer_id: customer?.id,
    },
  });

  const quanty = Math.floor(prod?.quantity * 0.15);
  const total = parseFloat(prod.price) * quanty;
  if (total > parseFloat(wallet?.funds)) {
    throw new AppError(`${customer?.id}Insuficient funds`);
  }
  if (quanty < 0) {
    throw new AppError(`${prod?.id}Insuficient products`);
  }
  const orders_prods = await prisma.orders_products.create({
    data: {
      product_id: prod?.id,
      quantity: quanty,
      price: total,
    },
  });
  const order = await prisma.orders.create({
    data: {
      customer_id: customer?.id,
    },
  });
  const update = await prisma.orders_products.update({
    where: {
      id: orders_prods.id,
    },
    data: {
      order_id: order.id,
    },
  });
  const prodQ = prod.quantity - quanty;
  const upProd = await prisma.products.update({
    where: {
      id: prod.id,
    },
    data: {
      quantity: prodQ,
    },
  });

  res.json(order);
});

orderRouter.get('/see/all', async (req, res) => {
  const orders = await prisma.orders_products.findMany();
  res.json(orders);
});

orderRouter.get('/see/one/:id', async (req, res) => {
  const order = await prisma.orders_products.findFirst({
    where: {
      id: req.params.id,
    },
  });
  if (!order) {
    throw new AppError('Not found order');
  }
  res.json(order);
});

export default orderRouter;
