import { forwardRef, HttpException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from '../utils/cryptogram';
import { AppCode } from '../common/code.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    // JWT验证 - Step 2: 校验用户信息
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne(username);
        if(!user) {
            throw new NotFoundException('用户不存在')
        }
        const hashedPassword = user.password;
        const salt = user.salt;
        const hashPassword = encryptPassword(password, salt);
        if(hashedPassword !== hashPassword) {
            throw new UnauthorizedException('密码错误')
        }
        return user;
    }

    // JWT验证 - Step 3: 处理 jwt 签证
    async certificate(user: any) {
        const payload = {
            user_id: user.id,
            username: user.username
        };
        try {
            const token = this.jwtService.sign(payload);
            return {
                info: {
                    token
                }
            }
// +      //实例化 redis
// +      const redis = await RedisInstance.initRedis('auth.certificate', 0);
// +      // 将用户信息和 token 存入 redis，并设置失效时间，语法：[key, seconds, value]
// +      await redis.setex(`${user.id}-${user.username}`, 300, `${token}`);
        } catch (error) {
            throw new UnauthorizedException('账号或密码错误');
        }
    }


}
