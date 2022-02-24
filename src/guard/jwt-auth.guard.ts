import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ApiException } from '../exceptions/api.exception';
import { IS_SKIPAUTH_KEY } from '../decorator/constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_SKIPAUTH_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    /* 主动处理错误 */
    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new ApiException(11002);
        }
        return user;
    }

}
