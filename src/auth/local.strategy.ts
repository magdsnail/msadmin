import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super(
            {
                usernameFiled: 'username',
                passwordField: 'password',
                passReqToCallback: true,   //设置回调函数第一个参数为 request
            }
        );
    }

    async validate(request: any, username: string, password: string): Promise<any> {
        const body = request.body;
        await this.authService.checkImgCaptcha(body.uuid, body.code);
        const user = await this.authService.validateUser(username, password);
        return user;
    }
}