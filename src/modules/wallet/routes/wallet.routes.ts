import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import WalletController from '../controllers/WalletController';
import isAuthenticated from '@shared/http/middleware/isAuthenticated';
import { PrismaClient } from '@prisma/client';
import AppError from '@shared/http/errors/AppError';

const walletRouter = Router();
const walletController = new WalletController();
const prisma = new PrismaClient();

walletRouter.get(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  walletController.show,
);
walletRouter.post(
  '/',
  isAuthenticated,
  celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().uuid().required(),
      funds: Joi.number().default(0),
    },
  }),
  walletController.create,
);

walletRouter.put(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.BODY]: {
      funds: Joi.number().required(),
    },
  }),
  walletController.update,
);

//prisma

walletRouter.post('/create', async (req, res) => {
  const customer = await prisma.costumers.findFirst({
    where: {
      wallet: {
        none: {},
      },
    },
  });
  if (!customer) {
    throw new AppError('User not found');
  }
  const customer_id = customer?.id;
  const createWallet = await prisma.wallet.create({
    data: {
      Customer_id: customer_id,
      funds: 0,
    },
  });
  res.json(createWallet);
});

walletRouter.get('/see/all', async (req, res) => {
  const wallet = await prisma.wallet.findMany();
  if (!wallet) {
    throw new AppError('Wallet(s) not found');
  }
  res.json(wallet);
});

walletRouter.get('/see/one/:id', async (req, res) => {
  const wallet = await prisma.wallet.findFirst({
    where: {
      id: req.params.id,
    },
  });
  if (!wallet) {
    throw new AppError('Wallet not found');
  }
  res.json(wallet);
});

walletRouter.put('/up/:id', async (req, res) => {
  const wallet = await prisma.wallet.findFirst({
    where: {
      id: req.params.id,
    },
  });
  if (!wallet) {
    throw new AppError('Wallet not found');
  }

  const money = parseFloat(wallet.funds) + Math.floor(Math.random() * 1000);
  const upWallet = await prisma.wallet.update({
    where: { id: req.params.id },
    data: {
      funds: money,
    },
  });
  res.json(upWallet);
});
export default walletRouter;
