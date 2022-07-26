/* eslint-disable prefer-const */
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';
import UserController from '../controllers/UserController';
import isAuthenticated from '../../../shared/http/middleware/isAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';
import { PrismaClient } from '@prisma/client';
import { geradorNome } from 'gerador-nome';
import { hashSync } from 'bcryptjs';

const usersRouter = Router();
const userController = new UserController();
const userAvatarController = new UserAvatarController();

const prisma = new PrismaClient();

const upload = multer(uploadConfig);

usersRouter.get('/', isAuthenticated, userController.index);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  userController.create,
);

usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

//Prisma

usersRouter.post('/create', async (req, res) => {
  let nome = geradorNome();
  let pass = hashSync('123456', 10);
  const user = await prisma.user.create({
    data: {
      name: `${nome}`,
      email: `${nome}@mail.com`,
      password: pass,
    },
  });
  res.status(201).json({ user });
});

usersRouter.get('/see', async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
  });
  res.json(users);
});

usersRouter.get('/last', async (req, res) => {
  const user = await prisma.user.findFirst({
    orderBy: { created_at: 'desc' },
  });
  res.status(200).json(user);
});

export default usersRouter;
