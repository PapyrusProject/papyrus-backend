import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './RegisterDTO';
import { LoginDTO } from './LoginDTO';

@Controller({
  path: '/auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDTO) {
    try {
      const user = await this.authService.register(registerDto);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/login')
  async login(@Body() loginDTO: LoginDTO) {
    try {
      console.log({ loginDTO });
      const token = await this.authService.login(loginDTO);
      return {
        message: 'Logged in, redirecting!',
        token,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
