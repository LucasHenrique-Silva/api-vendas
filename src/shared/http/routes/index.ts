import customerRouter from '../../../modules/customers/routers/Customer.routes';
import orderRouter from '../../../modules/orders/routes/order.routes';
import productRouter from '@modules/products/routes/Produte.routes';
import passwordRouter from '@modules/users/routes/password.routes';
import profileRouter from '@modules/users/routes/profile.routes';
import sessionsRouter from '@modules/users/routes/sessions.routes';
import usersRouter from '@modules/users/routes/Users.routes';
import walletRouter from '@modules/wallet/routes/wallet.routes';
import body_parser from 'body-parser';

import { Router } from 'express';

const routes = Router();

routes.use('/products', productRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/customer', customerRouter);
routes.use('/order', orderRouter);
routes.use('/wallet', walletRouter);
routes.use(body_parser.json());
routes.get('/', (req, res) => {
  return res.json({ msg: 'Ola usuario' });
});

export default routes;
