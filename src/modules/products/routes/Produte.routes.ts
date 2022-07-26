import { Router } from 'express';
import ProductsController from '../controllers/ProductsController';
import { celebrate, Joi, Segments } from 'celebrate';
import { PrismaClient } from '@prisma/client';
import AppError from '@shared/http/errors/AppError';

const productRouter = Router();
const productsController = new ProductsController();
const prisma = new PrismaClient();

function geraStringAleatoria(tamanho: number) {
  let stringAleatoria = '';
  const caracteres =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < tamanho; i++) {
    stringAleatoria += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length),
    );
  }
  return stringAleatoria;
}

productRouter.get('/', productsController.index);
productRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  productsController.show,
);
productRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      quantity: Joi.number().required(),
    },
  }),
  productsController.create,
);
productRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      quantity: Joi.number().required(),
    },
  }),
  productsController.update,
);
productRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  productsController.delete,
);

//Prisma

productRouter.post('/create', async (req, res) => {
  const prod = geraStringAleatoria(Math.floor(Math.random() * 8));
  const prodExists = await prisma.products.findFirst({
    where: {
      name: prod,
    },
  });
  if (prodExists) {
    throw new AppError('Product already registered');
  }
  const product = await prisma.products.create({
    data: {
      name: `${prod}`,
      price: Math.floor(Math.random() * 3500),
      quantity: Math.floor(Math.random() * 200),
    },
  });
  res.json(product);
});

productRouter.get('/see/all', async (req, res) => {
  const products = await prisma.products.findMany();
  if (!products) {
    throw new AppError('Products not found');
  }
  res.status(200).json(products);
});

productRouter.get('/see/one/:id', async (req, res) => {
  const product = await prisma.products.findFirst({
    where: {
      id: req.params.id,
    },
  });
  if (!product) {
    throw new AppError('Product not found');
  }
  res.json(product);
});

productRouter.delete('/delete/one/:id', async (req, res) => {
  const product = await prisma.products.findFirst({
    where: {
      id: req.params.id,
    },
  });
  if (!product) {
    throw new AppError('Product not found');
  }
  const del = await prisma.products.delete({
    where: {
      id: req.params.id,
    },
  });
  res.send(`Product ${product?.name} deleted`);
});

productRouter.put('/update/one/:id', async (req, res) => {
  const prod = geraStringAleatoria(Math.floor(Math.random() * 8));
  const findProd = await prisma.products.findFirst({
    where: {
      name: prod,
    },
  });
  if (findProd) {
    throw new AppError('Product alredy exists');
  }
  const updateprod = await prisma.products.update({
    data: {
      name: `${prod}`,
      price: Math.floor(Math.random() * 3500),
      quantity: Math.floor(Math.random() * 200),
    },
    where: {
      id: req.params.id,
    },
  });
  res.json(updateprod);
});
export default productRouter;
