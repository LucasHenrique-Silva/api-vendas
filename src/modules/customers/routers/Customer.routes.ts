/* eslint-disable prefer-const */
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import CustomersController from '../controllers/CustomersController';
import isAuthenticated from '../../../shared/http/middleware/isAuthenticated';
import { PrismaClient } from '@prisma/client';
import { geradorNome } from 'gerador-nome';
import AppError from '../../../shared/http/errors/AppError';

const customerRouter = Router();
const customerController = new CustomersController();
const prisma = new PrismaClient();

customerRouter.get('/', isAuthenticated, customerController.index);
customerRouter.get(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  customerController.show,
);
customerRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  }),
  customerController.create,
);
customerRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  }),
  customerController.update,
);
customerRouter.delete(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  customerController.delete,
);
//prisma

customerRouter.post('/create', async (req, res) => {
  let nome = geradorNome();
  const customer = await prisma.costumers.create({
    data: {
      name: `${nome}`,
      email: `${nome}@email.com`,
    },
  });
  res.status(201).json(customer);
});

customerRouter.get('/all/see', async (req, res) => {
  const costumers = await prisma.costumers.findMany();
  if (!costumers) {
    throw new AppError('Users not found');
  }
  res.json(costumers);
});

customerRouter.get(`/one/:id`, async (req, res) => {
  const customer = await prisma.costumers.findFirst({
    where: {
      id: req.params.id,
    },
  });
  if (!customer) {
    throw new AppError('User not found');
  }
  res.json(customer).sendStatus(201);
});

customerRouter.delete('/delete/:id', async (req, res) => {
  const customer = await prisma.costumers.findFirst({
    where: {
      id: req.params.id,
    },
  });
  if (!customer) {
    throw new AppError('User not found');
  }
  const delCustomer = await prisma.costumers.delete({
    where: {
      id: req.params.id,
    },
  });
  res.send(`User ${customer?.name} deleted`);
});

export default customerRouter;
