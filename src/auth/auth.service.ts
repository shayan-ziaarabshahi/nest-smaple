import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDTO, SignInDTO } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserToken } from './types';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }

    async signUp(dto: SignUpDTO) {
        const hash = await argon.hash(dto.hash)
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                }
            })
            return { access_token: await this.signToken(user.id, user.email) }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Cridentials taken')
                }
            }
        }
    }

    async signIn(dto: SignInDTO) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        if (!user) throw new ForbiddenException('Cridentials incorrect')

        const doesPasswordMatches = await argon.verify(user.hash, dto.hash)
        if (!doesPasswordMatches) throw new ForbiddenException('Cridentials incorrect')

        return { access_token: await this.signToken(user.id, user.email) }
    }

    signToken(userId: UserToken["sub"], email: UserToken["email"]) {
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET')
        return this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret
        })
    }
}