import { forwardRef, HttpException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from '../utils/cryptogram';
import { AppCode } from '../common/code.enum';
import { RedisService } from '../dynamic/redis/redis.service';
import { CAPTCHA_IMG_KEY, USER_TOKEN_KEY, USER_VERSION_KEY } from '../contants/redis.contant';
import { ApiException } from '../exceptions/api.exception';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
    ) { }

    // JWT验证 - Step 2: 校验用户信息
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne(username);
        if (!user) {
            throw new NotFoundException('用户不存在')
        }
        const hashedPassword = user.password;
        const salt = user.salt;
        const hashPassword = encryptPassword(password, salt);
        if (hashedPassword !== hashPassword) {
            throw new UnauthorizedException('密码错误')
        }
        return user;
    }

    //校验验证码
    async checkImgCaptcha(uuid: string, code: string): Promise<void> {
        const result = await this.redisService.getRedis('admin').get(`${CAPTCHA_IMG_KEY}:${uuid}`);
        if (!result || code.toLowerCase() !== result.toLowerCase()) {
            throw new ApiException(10002);
        }
        // 校验成功后移除验证码
        await this.redisService.getRedis('admin').del(`${CAPTCHA_IMG_KEY}:${uuid}`);
    }

    // JWT验证 - Step 3: 处理 jwt 签证
    async certificate(user: any) {
        const payload = {
            user_id: user.id,
            username: user.username,
            pv: 1
        };
        const token = this.jwtService.sign(payload);
        return token;
        // try {
        //     const token = this.jwtService.sign(payload);
        //     return token;
            // +      //实例化 redis
            // +      const redis = await RedisInstance.initRedis('auth.certificate', 0);
            // +      // 将用户信息和 token 存入 redis，并设置失效时间，语法：[key, seconds, value]
            // +      await redis.setex(`${user.id}-${user.username}`, 300, `${token}`);
        // } catch (error) {
            // throw new UnauthorizedException('账号或密码错误');
        // }
    }

     /* 判断token 是否过期 或者被重置 */
     async validateToken(user_id: string, pv: number, restoken: string) {
        const token = await this.redisService.getRedis('admin').get(`${USER_TOKEN_KEY}:${user_id}`)
        if (restoken !== token) throw new ApiException(11002);
        const passwordVersion = Number(await this.redisService.getRedis('admin').get(`${USER_VERSION_KEY}:${user_id}`))
        if (pv !== passwordVersion) throw new ApiException(11001)
    }

    async delToken(token: string) {
        try {
            const payload = this.jwtService.verify(token)
            if (await this.redisService.getRedis('admin').get(`${USER_TOKEN_KEY}:${payload.user_id}`)) {
                await this.redisService.getRedis('admin').del(`${USER_TOKEN_KEY}:${payload.user_id}`);
                return {};
            }
        } catch (error) {
            
        }
       
    }

}
