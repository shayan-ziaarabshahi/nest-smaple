import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDTO } from './dto';
import { UserToken } from 'src/auth/types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getMe(userId: UserToken['sub']) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    delete user.hash;
    return user;
  }

  async editUser(userId: UserToken['sub'], dto: EditUserDTO) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      // we have  "whitelist:true" in global pipe so we can be confident to spread the dto
      data: { ...dto },
    });
    delete user.hash;
    return user;
  }
}
