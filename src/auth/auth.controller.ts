import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO, SignInDTO } from './dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('sign-up')
    signUp(@Body() dto: SignUpDTO) {
        return this.authService.signUp(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    signIn(@Body() dto: SignInDTO) {
        return this.authService.signIn(dto)
    }
}
