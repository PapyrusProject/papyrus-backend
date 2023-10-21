import { Request, Response } from 'express'
import { compareSync, hashSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import prisma from '../database'

export class AuthController {
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { username, email, password } = req.body

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing Arguments' })
      }

      if (!email.includes('@')) {
        return res.status(400).json({ message: 'Invalid Email' })
      }

      const userExists = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (userExists?.username === username || userExists?.email === email) {
        return res.status(400).json({ message: 'User already exists' })
      }

      const hashedPassword = hashSync(password, 10)

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
      })

      return res.status(200).json({ user })
    } catch (error) {
      return res.status(400).json({ message: `an error occurred while processing your request` })
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({ message: 'Missing Arguments' })
      }

      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      })

      if (!user) {
        return res.status(400).json({ message: 'User not found' })
      }

      const IsValidPassword = compareSync(password, user.password)

      if (!IsValidPassword) {
        return res.status(400).json({ message: 'Invalid Password' })
      }

      const token = sign({ id: user.id }, String(process.env.JWT_SECRET), {
        expiresIn: '1h',
      })

      return res.status(200).json({ message: 'Logged in, redirecting!', token })
    } catch (error) {
      return res.status(400).json({ message: `an error occurred while processing your request` })
    }
  }
}
