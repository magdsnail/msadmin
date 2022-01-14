
// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { Reflector } from '@nestjs/core'

// /**
//  * 角色识别
//  */
// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private readonly reflector: Reflector){}

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const roles = this.reflector.get<string[]>('roles', context.getHandler()); // 从控制器注解中得到的角色组信息。
//     if (!roles) {
//       return true;
//     }
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     const hasRole = () => user.roles.some((role) => roles.includes(role)); // 是否匹配到角色
//     return user && user.roles && hasRole();
//   }
// }

import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { ROLES_KEY } from '../decorator/constant';


@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		@Inject(UserService)
		private readonly userService: UserService,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
		//   context.getHandler(),
		//   context.getClass(),
		// ]);
		const requiredRoles = this.reflector.getAllAndMerge<string[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (!requiredRoles.length) {
			return true;
		}
		const request = context.switchToHttp().getRequest();
		const { user } = request;
		if(!user) {
			return false;
		}
		const { is_admin, permissions, department_id, departmentIds } = await this.userService.findUserPerms(user);
		request.user = {
			...user,
			department_id,
			departmentIds
		};
		if (is_admin) {
			return true;
		}
		return requiredRoles.some((role) => permissions.includes(role));
	}

}
