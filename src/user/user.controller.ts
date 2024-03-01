import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JWTGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { EditUserDTO } from './dto';
import { UserToken } from 'src/auth/types';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }
    @Get('me')
    @UseGuards(JWTGuard)
    getMe(@GetUser('sub') userId: UserToken['sub']) {
        return this.userService.getMe(userId)
    }

    @Patch('edit-user')
    @UseGuards(JWTGuard)
    editUser(@GetUser('sub') userId: UserToken['sub'], @Body() dto: EditUserDTO) {
        return this.userService.editUser(userId, dto)
    }
}
