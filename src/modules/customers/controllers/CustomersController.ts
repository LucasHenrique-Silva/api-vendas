import { Request, Response } from 'express';
import CreateCustomerSevice from '../services/CreateCustomerService';
import DeleteCustomersService from '../services/DeleteCustomer';
import ListCustomersService from '../services/ListCustomerService';
import ShowCustomersService from '../services/ShowCustomersService';
import UpdateCustomerService from '../services/UpdateCustomerService';

export default class CustomersController {
  public async index(req: Request, res: Response) {
    const listCustomes = new ListCustomersService();

    const customers = await listCustomes.execute();

    return res.json(customers);
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;

    const showCustomer = new ShowCustomersService();

    const customer = await showCustomer.execute({ id });

    return res.json(customer);
  }

  public async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const createCustomer = new CreateCustomerSevice();

    const customer = await createCustomer.execute({
      name,
      email,
    });

    return res.json(customer);
  }

  public async update(req: Request, res: Response) {
    const { name, email } = req.body;
    const { id } = req.params;
    const updateCustomer = new UpdateCustomerService();

    const customer = await updateCustomer.execute({
      id,
      name,
      email,
    });
    return res.json(customer);
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    const deleteCustomer = new DeleteCustomersService();

    const customer = await deleteCustomer.execute({ id });

    return res.json([]);
  }
}
