import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import SessionsController from '../controllers/SessionsController';
import { PrismaClient } from '@prisma/client';

const sessionsRouter = Router();
const sessionController = new SessionsController();

const prisma = new PrismaClient();
const user = prisma.user.findFirst();
sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionController.create,
);

export default sessionsRouter;
