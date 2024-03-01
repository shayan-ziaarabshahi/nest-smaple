import {
    createParamDecorator,
    ExecutionContext
} from "@nestjs/common"


export const GetUser = createParamDecorator((data: 'sub' | 'email' | null, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest()
    if (data) return request.user[data]
    return request.user
})