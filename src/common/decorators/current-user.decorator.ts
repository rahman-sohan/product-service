import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserTokenData } from '../interfaces/auth.interface';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserTokenData => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
