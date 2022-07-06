import { Request, Response } from 'express';
import SendForgotPasswordEmailServices from '../services/SendForgotPasswordEmailServices';

export default class ForgotPasswordController {
  public async create(req: Request, res: Response) {
    const { email } = req.body;
    const sendForgotPassword = new SendForgotPasswordEmailServices();

    await sendForgotPassword.execute({
      email,
    });

    return res.status(204).json();
  }
}
