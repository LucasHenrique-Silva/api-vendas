import { Request, Response } from 'express';
import CreateWalletService from '../services/CreateWalletService';
import ShowWalletService from '../services/ShowFunds';
import UpdateWalletService from '../services/updatefunds';

export default class walletController {
  public async show(req: Request, res: Response) {
    const { id } = req.params;

    const showWallet = new ShowWalletService();

    const wallet = await showWallet.execute(id);

    return res.json(wallet);
  }

  public async create(req: Request, res: Response) {
    const { customer_id } = req.body;

    const createOrder = new CreateWalletService();

    const wallet = await createOrder.execute(customer_id);

    return res.json(wallet);
  }

  public async update(req: Request, res: Response) {
    const { funds } = req.body;
    const { id } = req.params;
    const updatewallet = new UpdateWalletService();
    const Wallet = await updatewallet.execute({
      id,
      funds,
    });
    return res.json(Wallet);
  }
}
