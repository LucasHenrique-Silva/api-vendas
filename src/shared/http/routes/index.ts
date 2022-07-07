import customerRouter from '@modules/customers/routers/Cutomer.routes';
import orderRouter from '@modules/orders/routes/order.routes';
import productRouter from '@modules/products/routes/Produte.routes';
import passwordRouter from '@modules/users/routes/password.routes';
import profileRouter from '@modules/users/routes/profile.routes';
import sessionsRouter from '@modules/users/routes/sessions.routes';
import usersRouter from '@modules/users/routes/Users.routes';

import { Router } from 'express';

const routes = Router();

routes.use('/products', productRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/customer', customerRouter);
routes.use('/order', orderRouter);

routes.get('/', (req, res) => {
  return res.json({ msg: 'Ola usuario' });
});

export default routes;
