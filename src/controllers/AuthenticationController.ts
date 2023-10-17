import { Request, Response } from 'express'

export class AuthController {
  public async register(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({ message: 'register' })
  }

  public async login(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({ message: 'login' })
  }
}
