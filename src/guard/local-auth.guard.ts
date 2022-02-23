import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('local') {
    context: ExecutionContext;
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        this.context = context;
        return super.canActivate(context);
    }

    //  /* 主动处理错误,进行日志记录 */
    //  handleRequest(err, user, info) {
    //     if (err || !user) {
    //         const request = this.context.switchToHttp().getRequest()
    //         request.user = user
    //         this.logService.addLogininfor(request, err.response)
    //         throw err || new ApiException(err);
    //     }
    //     return user
    // }
}
