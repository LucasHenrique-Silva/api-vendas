import { Request, Response } from 'express';
import CreateSectionSevice from '../services/CreateSectionsServices';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const createSession = new CreateSectionSevice();

    const user = await createSession.execute({
      email,
      password,
    });

    return res.json(user);
  }
}
