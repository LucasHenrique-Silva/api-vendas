import { Request, Response } from 'express';
import UpdateUserAvatarSevice from '../services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(req: Request, res: Response) {
    const updateAvatar = new UpdateUserAvatarSevice();

    const user = updateAvatar.execute({
      user_id: req.user.id,
      avatarFileName: req.file?.filename as string,
    });

    return res.json(user);
  }
}
