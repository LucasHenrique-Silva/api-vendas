import { Request, Response } from 'express';
import CreateUserSevice from '../services/CreateUserService';
import ListUserService from '../services/ListUserService';

export default class UserController {
  public async index(req: Request, res: Response) {
    const listUser = new ListUserService();

    const users = await listUser.execute();

    return res.json(users);
  }

  public async create(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const createUser = new CreateUserSevice();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return res.json(user);
  }
}
