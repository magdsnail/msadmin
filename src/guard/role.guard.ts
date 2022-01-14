import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common'
import { Reflector } from '@nestjs/core';

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private readonly reflector: Reflector, @Inject('PermService') private readonly permSerivce: PermService) { }

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const req: Request = context.switchToHttp().getRequest()
//         const user = req['user']
//         if (!user) return false
        // // 当前请求所需权限
        // const currentPerm = this.reflector.get<string>('permissions', context.getHandler())
        // // 空， 标识不需要权限
        // if (!currentPerm) return true
        // // 根据用户id 查询所拥有的权限
        // const permList = await this.permSerivce.findUserPerms(user.id)
        // const perms: string[] = []
        // for (let i = 0, len = permList.length; i < len; i++) {
        //     permList[i]['m_perms'].indexOf(',') > -1 ? perms.push(...permList[i]['m_perms'].split(',')) : perms.push(permList[i]['m_perms'])
        // }
        // // currentPerm 有值，则需对比该用户所有权限
        // // return perms.includes(currentPerm)
        // // nestjs 原生 ForbiddenException 英文，不符合，所以抛出自定义异常
        // if (perms.includes(currentPerm)) return true
        // throw new ForbiddenException()
//     }
// }


// src/guards/rbac.guard.ts
// - import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
// import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
// + import { RedisInstance } from '../database/redis';

// @Injectable()
// export class RbacGuard implements CanActivate {
//   // role[用户角色]: 0-超级管理员 | 1-管理员 | 2-开发&测试&运营 | 3-普通用户（只能查看）
//   constructor(private readonly role: number) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

// +    // 获取请求头里的 token
// +    const authorization = request['headers'].authorization || void 0;
// +    const token = authorization.split(' ')[1]; // authorization: Bearer xxx

// +    // 获取 redis 里缓存的 token
// +    const redis = await RedisInstance.initRedis('TokenGuard.canActivate', 0);
// +    const key = `${user.userId}-${user.username}`;
// +    const cache = await redis.get(key);

// +    if (token !== cache) {
// +      // 如果 token 不匹配，禁止访问
// +      throw new UnauthorizedException('您的账号在其他地方登录，请重新登录');
// +    }

//     if (user.role > this.role) {
//       // 如果权限不匹配，禁止访问
//       throw new ForbiddenException('对不起，您无权操作');
//     }
//     return true;
//   }
// }

// 作者：布拉德特皮
// 链接：https://juejin.cn/post/6854573216879345672
// 来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。